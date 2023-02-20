from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, constr


class UserBase(BaseModel):
    username: constr(strip_whitespace=True)


class UserCreate(UserBase):
    fullname: constr(strip_whitespace=True)
    password: str
    email: EmailStr = None

class UserRegister(UserBase):
    fullname: constr(strip_whitespace=True)
    password: str
    email: EmailStr = None
   



class UserUpdate(UserCreate):
    class Config:
        orm_mode = True


class UserAuthenticate(UserBase):
    password: str

class IAMAuthenticate(UserBase):
    alias_or_accid: str
    password: str

class UserInit(BaseModel):
    password: str


class PasswordReset(BaseModel):
    passwd: str

    class Config:
        orm_mode = True

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    reset_password_token: str
    new_password:str
    confirm_password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    token_type: str
    access_token: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None


class TokenData(BaseModel):
    username: str = None


