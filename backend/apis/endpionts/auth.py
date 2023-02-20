import base64
import requests
# from git import Repo
from typing import Any
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends ,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from crud import user as crud_users
from Schemas import schemas
from Schemas.schemas import Token
from Security import deps
from Security.tokens import validate_user, decode_access_token, iam_validate_user

router = APIRouter()


@router.post("/access-token", response_model=Token)
def login_access_token(
    user: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(deps.get_db)) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    return validate_user(db, user.username, user.password)


@router.post("/access-token-json", response_model=Token)
def login_access_token_json(
    user: schemas.UserAuthenticate,
    db: Session = Depends(deps.get_db)) -> dict:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    return validate_user(db, user.username, user.password)


@router.get("/{token}")
def verify_token(token,
    db: Session = Depends(deps.get_db)):
    '''
    Verify Access Token
    '''
    try:
        payload = decode_access_token(data=token)
        userid: int = payload.get("sub")
        user = crud_users.get_user_by_id(db, userid)
        return user
    except Exception as err:
        raise HTTPException(
            status_code=401,
            detail="Access Token Expired")

