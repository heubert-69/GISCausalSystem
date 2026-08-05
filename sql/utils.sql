-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    user_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    prediction INTEGER NOT NULL,
    confidence NUMERIC(5,4) NOT NULL,
    model_name VARCHAR(100),
    inference_time NUMERIC(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Store ML model metadata
CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50),      -- e.g., 'RandomForest', 'XGBoost', 'CausalForest'
    description TEXT,
    hyperparameters JSONB,
    file_path TEXT NOT NULL,    -- path to saved model file (e.g., .pkl)
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Model Experiments (Experimental)
CREATE TABLE IF NOT EXISTS experiments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    model_id INTEGER REFERENCES models(id) ON DELETE SET NULL,
    train_data_id INTEGER REFERENCES preprocessed_data(id) ON DELETE SET NULL,
    test_data_id INTEGER REFERENCES preprocessed_data(id) ON DELETE SET NULL,
    metrics JSONB,              -- store evaluation metrics (accuracy, F1, etc.)
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
