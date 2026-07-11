from fastapi import FastAPI
from fastapi import HTTPException
from app.routers.users import router as users_router
from app.database import Base, engine
from app.models.user import User as user_model


app = FastAPI()
Base.metadata.create_all(bind=engine)
app.include_router(users_router)



users_list = {
    1: {"id": 1, "name": "Nazar"},
    2: {"id": 2, "name": "John"}
}




