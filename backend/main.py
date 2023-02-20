from fastapi import FastAPI
from  apis.api import api_router
from db import models
from config.database import engine
from config.api import settings

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
#app = FastAPI(title=f"{settings.PROJECT_NAME}",
#              description=f"{settings.DESCRIPTION}",
#             openapi_url=f"{settings.API_V1_STR}/openapi.json",
#              version=f"{settings.VERSION}",)

origins = [
   
    "http://localhost:3000",
    "http://127.0.0.1:3000",

]

 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)

app.include_router(api_router , prefix=settings.API_V1_STR)
