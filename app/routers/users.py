from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User


router = APIRouter(prefix="/users"
                   ,tags=['Users'])

@router.get("/")
def get_users():
    return {'users': []}


@router.post('/', response_model=UserResponse)
def create_user(user: UserCreate,
                db: Session = Depends(get_db)):

    db_user = User(email=user.email, password_hash=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
