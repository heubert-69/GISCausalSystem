from pydantic import BaseModel, validator, Field
from datetime import datetime, timedelta
from typing import Optional
from security_utils import *

class UserSchema(BaseModel):
    """Schema for user registration (input)."""
    user: str = Field(..., min_length=3, max_length=50, description="Username")
    password: str = Field(..., min_length=8, description="Plain password (will be hashed)")
    user_name: Optional[str] = Field(None, max_length=100, description="Display name")

    @validator('password')
    def validate_password_strength(cls, v):
        if not any(ch.isdigit() for ch in v):
            raise ValueError('Password must contain at least one digit')
        if not any(ch.isupper() for ch in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserInDB(BaseModel):
    """Schema for user stored in database (with hashed password)."""
    user: str
    hashed_password: str
    user_name: Optional[str] = None
    created_at: Optional[datetime] = None


class TokenSchema(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60  # seconds


class LoginSchema(BaseModel):
    """Schema for login request."""
    user: str
    password: str





#For Main Functionality
class PredictionSchema(BaseModel):
    """Schema for model prediction input/output."""
    prediction: int = Field(..., description="Predicted class/label")
    time: Optional[datetime] = Field(default_factory=datetime.now, description="Timestamp of prediction")
    inference_time: Optional[float] = Field(None, ge=0, description="Inference duration in seconds")
    model_name: Optional[str] = Field(None, max_length=100, description="Model identifier")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")

    @validator('confidence')
    def confidence_range(cls, v):
        if not (0 <= v <= 1):
            raise ValueError('Confidence must be between 0 and 1')
        return v


class DatabaseSchema(BaseModel):
    """Schema for database connection configuration."""
    db_host: str = Field(..., description="Database hostname or IP")
    db_port: int = Field(5432, ge=1, le=65535, description="Database port")
    db_name: str = Field(..., min_length=1, description="Database name")
    db_user: str = Field(..., min_length=1, description="Database user")
    db_password: str = Field(..., min_length=1, description="Database password")
    db_driver: str = Field("postgresql", description="Database driver (e.g., postgresql, mysql)")

    @property
    def connection_string(self) -> str:
        return f"{self.db_driver}://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


class PredictionResponse(BaseModel):
    """Schema for API response after prediction."""
    status: str = Field("success", description="Status of the request")
    prediction: PredictionSchema
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    """Schema for API error responses."""
    status: str = Field("error", description="Error status")
    message: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
