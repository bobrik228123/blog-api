from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.post import PostCreate, PostResponse
from app.database import get_db
from app.core.security import get_current_user
from app.models.post import Post
from app.models.user import User


router = APIRouter(prefix="/post", tags=["Posts"])

@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user), ):
    db_post = Post(title=post.title, content=post.content, user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post





