from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_password, create_access_token

from app.models.user import User
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter( prefix="/auth",
                    tags=['Auth'])


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends() ,db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == form_data.username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": str(db_user.id)})

    return {"access_token": access_token, "token_type": "bearer"}

