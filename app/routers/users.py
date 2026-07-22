from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.security import hash_password


router = APIRouter(prefix="/users"
                   ,tags=['Users'])




@router.post('/', response_model=UserResponse)
def create_user(user: UserCreate,
                db: Session = Depends(get_db)):

    db_user = User(email=user.email, password_hash=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get('/', response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.get('/{user_id}', response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete('/{user_id}', response_model=UserResponse)
def delete_user(user_id:int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return db_user

@router.put('/{user_id}', response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.email is not None:
        db_user.email = user.email

    if user.password is not None:
        db_user.password_hash = hash_password(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user

