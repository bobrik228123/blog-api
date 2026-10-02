from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.database import Base




class Likes(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))

    __table_args__ = (UniqueConstraint("user_id", "post_id"),)
