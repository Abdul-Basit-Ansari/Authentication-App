from typing import List
import os

from pydantic import BaseSettings


class Settings(BaseSettings):
    # API server  config
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Authentication Platform"
    DESCRIPTION: str = '''
    Simple Authentication App
                    '''
    SECRET_KEY: str = os.getenv('APP_SECRET_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
    ALGORITHM = "HS256"
    VERSION: str = "1.0.0"
    PASSWORD_LEN: int = 4
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1
    #init user
    INIT_USER = {
        "username": os.getenv('APP_INIT_USER_NAME', "admin"),
        "fullname": os.getenv('APP_INIT_USER_FULLNAME', "Super Administrator User"),
        "email": os.getenv('APP_INIT_USER_email', "admin@codebybasit.com")
    }

settings = Settings()
