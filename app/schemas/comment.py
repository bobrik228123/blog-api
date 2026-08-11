from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str
    post_id: int


class CommentResponse(BaseModel):
    content: str
    user_id: int
    post_id: int