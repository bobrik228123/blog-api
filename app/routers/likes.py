from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user
from app.schemas.likes import  LikeResponse
from app.models.post import Post
from app.models.user import User
from app.models.likes import Likes


router = APIRouter(
    prefix="/like",
    tags=["Likes"],
)

@router.post("/", response_model=LikeResponse)
def like( post_id : int , db: Session = Depends(get_db), current_user: User = Depends(get_current_user), ):
    db_post = db.query(Post).where(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")


    existing_like = db.query(Likes).where(Likes.post_id == post_id, Likes.user_id == current_user.id).first() #we check for the second like
    if existing_like is not None:
        raise HTTPException(status_code=409, detail="You cannot like this post the second time")
    db_like = Likes(post_id=post_id, user_id=current_user.id)
    try:
        db.add(db_like)
        db.commit()
        db.refresh(db_like)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="You cannot like this post the second time")


    return db_like

