from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.post import PostCreate, PostResponse, PostUpdate
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


@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db),):
    return db.query(Post).all()



@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db),):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post


@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, post : PostUpdate, current_user: User = Depends(get_current_user),db : Session = Depends(get_db),):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    if current_user.id != db_post.user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this post")
    if post.title is not None:
        db_post.title = post.title
    if post.content is not None:
        db_post.content = post.content
    db.commit()
    db.refresh(db_post)
    return db_post


@router.delete("/{post_id}", response_model=PostResponse)
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    if current_user.id != db_post.user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this post")

    db.delete(db_post)
    db.commit()
    return db_post