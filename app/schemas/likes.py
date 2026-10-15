from pydantic import BaseModel



class LikeResponse(BaseModel):
    post_id: int
    user_id: int