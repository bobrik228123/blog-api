import bcrypt
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends
from app.models.user import User
from app.database import get_db
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
if not ACCESS_TOKEN_EXPIRE_MINUTES or not SECRET_KEY or not ALGORITHM:
    raise ValueError("Missing required environment variables")

def hash_password(password: str) -> str:
    password = password.encode("utf-8")
    hashed = bcrypt.hashpw(password, bcrypt.gensalt(12))
    return hashed.decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    password = password.encode("utf-8")
    hashed_password = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password, hashed_password)

def create_access_token(data:dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    return payload


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db : Session = Depends(get_db)):

    payload = decode_access_token(token)
    user_db = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user_db:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return user_db







