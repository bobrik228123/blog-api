from fastapi import APIRouter
from app.schemas.user import UserCreate, UserResponse


router = APIRouter(prefix="/users"
                   ,tags=['Users'])

@router.get("/")
def get_users():
    return {'users': []}


@router.post('/', response_model=UserResponse)
def create_user(user: UserCreate):
    return user
