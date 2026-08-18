from fastapi import FastAPI
from fastapi import HTTPException
from app.routers.users import router as users_router
from app.database import Base, engine
from app.models.user import User as user_model
from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.comments import router as comments_router


app = FastAPI()
Base.metadata.create_all(bind=engine)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)








