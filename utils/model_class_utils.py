from sklearn.base import BaseEstimator, TransformerMixin, ClassifierMixin
from sklearn.linear_model import *
import pandas as pd
import numpy as np
from sksurv.linear_model import *
from sklearn.model_selection import *

class DR_OOFTimeSeriesHybrid(BaseEstimator, ClassifierMixin):

    def __init__(self, base_models, survival_model, propensity_model, meta_model, n_splits=5):
        self.base_models = base_models
        self.survival_model = survival_model
        self.propensity_model = propensity_model
        self.meta_model = meta_model
        self.n_splits = n_splits

        self.platt_models_ = []
        self.isotonic_models_ = []

        self.threshold_ = 0.5

    # Explicitly implement get_params and set_params for robust cloning
    def get_params(self, deep=True):
        return {
            'base_models': self.base_models,
            'survival_model': self.survival_model,
            'propensity_model': self.propensity_model,
            'meta_model': self.meta_model,
            'n_splits': self.n_splits
        }

    def set_params(self, **params):
        for parameter, value in params.items():
            setattr(self, parameter, value)
        return self


    def _platt(self, x, y):
        model = LogisticRegression()
        model.fit(x.reshape(-1, 1), y)
        return model


    def _isotonic(self, x, y):
        model = IsotonicRegression(out_of_bounds="clip")
        model.fit(x, y)
        return model


    def _copula(self, x):
        x = np.asarray(x)
        ranks = rankdata(x, method="average") / (len(x) + 1.0)
        return norm.ppf(np.clip(ranks, 1e-6, 1 - 1e-6))


    def _calibrate_train(self, p_train, y_train):
        platt = self._platt(p_train, y_train)
        iso = self._isotonic(p_train, y_train)
        return platt, iso


    def _apply_calibration(self, p, platt, iso):
        p = p.reshape(-1, 1)
        p_platt = platt.predict_proba(p)[:, 1]
        p_iso = iso.transform(p.ravel())
        return 0.5 * p_platt + 0.5 * p_iso


    def _best_threshold(self, y_true, y_prob):
        thresholds = np.linspace(0.01, 0.99, 200)

        best_t = 0.5
        best_f1 = -1

        for t in thresholds:
            preds = (y_prob >= t).astype(int)
            f1 = f1_score(y_true, preds, zero_division=0)

            if f1 > best_f1:
                best_f1 = f1
                best_t = t

        return best_t


    def fit(self, X, y, y_surv, T):

        # Convert y and T to numpy arrays if they are pandas Series
        # This means they should be indexed directly later, not with .iloc
        if isinstance(y, pd.Series):
            y = y.values
        if isinstance(T, pd.Series):
            T = T.values

        tscv = TimeSeriesSplit(n_splits=self.n_splits)

        n_samples = X.shape[0]
        n_models = len(self.base_models)

        oof_logits = np.zeros((n_samples, n_models))
        oof_surv = np.zeros((n_samples, 1))
        oof_prop = np.zeros((n_samples, 1))
        oof_dr = np.zeros((n_samples, 1))

        self.platt_models_ = [[] for _ in self.base_models]
        self.isotonic_models_ = [[] for _ in self.base_models]

        oof_meta_preds = np.zeros(n_samples)

        for train_idx, val_idx in tscv.split(X):

            # X is a DataFrame, so use .iloc
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]

            # y and T are now numpy arrays, so use direct indexing
            y_train, y_val = y[train_idx], y[val_idx]
            y_surv_train = y_surv[train_idx]
            T_train, T_val = T[train_idx], T[val_idx]

            for i, model in enumerate(self.base_models):

                m = clone(model)
                m.fit(X_train, y_train)

                p_train = m.predict_proba(X_train)[:, 1]
                p_val = m.predict_proba(X_val)[:, 1]

                platt, iso = self._calibrate_train(p_train, y_train)

                self.platt_models_[i].append(platt)
                self.isotonic_models_[i].append(iso)

                p_val = self._apply_calibration(p_val, platt, iso)

                oof_logits[val_idx, i] = self._copula(p_val)

            # Survival model

            surv = clone(self.survival_model)
            surv.fit(X_train, y_surv_train)

            risk = surv.predict(X_val)
            oof_surv[val_idx, 0] = self._copula(risk)


            # Propensity model
            prop = clone(self.propensity_model)
            prop.fit(X_train, T_train)

            e_hat = prop.predict_proba(X_val)[:, 1]
            e_hat = np.clip(e_hat, 1e-6, 1 - 1e-6)

            oof_prop[val_idx, 0] = self._copula(e_hat)


            # Doubly robust
            y_event = y_val

            dr = ((T_val - e_hat) / (e_hat * (1 - e_hat))) * (y_event - risk) + risk

            oof_dr[val_idx, 0] = self._copula(dr)


        # Meta features
        X_meta = np.hstack([
            oof_logits,
            oof_surv,
            oof_prop,
            oof_dr,
            oof_logits * oof_surv
        ])

        self.meta_model.fit(X_meta, y)

        # store meta predictions for thresholding
        oof_meta_preds = self.meta_model.predict_proba(X_meta)[:, 1]

        # optimal threshold

        self.threshold_ = self._best_threshold(y, oof_meta_preds)

        # refit full models
        self.fitted_base_models_ = [clone(m).fit(X, y) for m in self.base_models]
        self.fitted_survival_model_ = clone(self.survival_model).fit(X, y_surv)
        self.fitted_propensity_model_ = clone(self.propensity_model).fit(X, T)

        return self


    def _transform(self, X):

        logits = []

        for i, m in enumerate(self.fitted_base_models_):

            p = m.predict_proba(X)[:, 1]
            p = np.clip(p, 1e-6, 1 - 1e-6)

            platt = self.platt_models_[i][-1]
            iso = self.isotonic_models_[i][-1]

            p = self._apply_calibration(p, platt, iso)
            logits.append(self._copula(p).reshape(-1, 1))

        X_ml = np.hstack(logits)

        risk = self._copula(self.fitted_survival_model_.predict(X))

        e_hat = self.fitted_propensity_model_.predict_proba(X)[:, 1]
        e_hat = np.clip(e_hat, 1e-6, 1 - 1e-6)
        e_hat = self._copula(e_hat)

        dr = risk * e_hat

        return np.hstack([
            X_ml,
            risk.reshape(-1, 1),
            e_hat.reshape(-1, 1),
            dr.reshape(-1, 1),
            X_ml * risk.reshape(-1, 1)
        ])


    def predict_proba(self, X):
        return self.meta_model.predict_proba(self._transform(X))


    def predict(self, X):
        proba = self.predict_proba(X)[:, 1]
        return (proba >= self.threshold_).astype(int)
