from fastapi import APIRouter
from apis.endpionts import user as user
from apis.endpionts import auth

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(auth.router, prefix="/authenticate", tags=["authentication"])