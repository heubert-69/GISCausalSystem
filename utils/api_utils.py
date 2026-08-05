import pandas as pd
import numpy as np
import joblib
from db_utils import *
from schema_utils import *

app = FastAPI()

@app.post("/register")
async def register(user_data: UserSchema):
    try:
        new_user = await create_user(user_data.user, user_data.password, user_data.user_name)
        return {"msg": f"User {new_user.username} created"}
    except asyncpg.UniqueViolationError:
        raise HTTPException(400, "Username already exists")

@app.post("/predict")
async def predict(pred_data: PredictionSchema, user_id: int):  # you'd get user_id from JWT
    pred_id = await log_prediction(
        user_id=user_id,
        prediction=pred_data.prediction,
        confidence=pred_data.confidence,
        model_name=pred_data.model_name,
        inference_time=pred_data.inference_time,
    )
    return {"prediction_id": pred_id}
