from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    #add id in future
    email: str




