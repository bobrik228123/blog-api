from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str



class CommentResponse(BaseModel):
    content: str
    user_id: int
    post_id: int

class CommentUpdate(BaseModel):
    content: str | None = None