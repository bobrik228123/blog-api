from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.comment import CommentCreate, CommentResponse, CommentUpdate
from app.database import get_db
from app.core.security import get_current_user
from app.models.post import Post
from app.models.user import User
from app.models.comment import Comment


router = APIRouter( tags=["Comments"])

@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
def create_comment(post_id : int, comment_create: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db_comment = Comment(
        content=comment_create.content,
        post_id=post_id,
        user_id=current_user.id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
def get_comments_by_post(post_id : int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post.comments

@router.patch("/comments/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, comment_update: CommentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db_comment.content = comment_update.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/comments/{comment_id}", response_model=CommentResponse)
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db.delete(db_comment)
    db.commit()
    return db_comment
