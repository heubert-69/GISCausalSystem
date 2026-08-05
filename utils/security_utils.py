import jwt
from pydantic import BaseModel, Field, validator
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

def hash_password(plain_password: str) -> str:
    """Hash a password using werkzeug's PBKDF2."""
    return generate_password_hash(plain_password, method='pbkdf2:sha256:600000')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return check_password_hash(hashed_password, plain_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    data: dict with claims (e.g., {"sub": username})
    expires_delta: optional custom expiry (defaults to JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode a JWT token and return the payload.
    Raises jwt.PyJWTError on invalid/expired token.
    """
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
