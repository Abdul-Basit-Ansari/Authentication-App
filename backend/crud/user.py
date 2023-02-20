import bcrypt
import sys
from sqlalchemy.orm import Session
from sqlalchemy import exc
import datetime

from Security.vault import vault_encrypt, vault_decrypt
from Security.tokens import get_password_hash
from config.api import settings
import db.models as models
import Schemas.schemas as schemas
import logging
from uuid import uuid4

logging.getLogger("uvicorn.error").propagate = False
logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logger = logging.getLogger(__name__)

hashing_passwd = get_password_hash


@vault_encrypt
def encrypt(secreto):
    try:
        return secreto
    except Exception as err:
        raise err


@vault_decrypt
def decrypt(secreto):
    try:
        return secreto
    except Exception as err:
        raise err




def check_same_user(db:Session,user, current_user:schemas.UserCreate) -> bool:
    try:
        if not user.isdigit():
            usr = get_user_by_username(db,user)
        usr = user
        c_usr = str(current_user.id)
        result = bool(set(usr).intersection(c_usr))
        return result
    except Exception as err:
        raise err



def get_user_by_username(db: Session, username: str):
    try:       
        return db.query(
            models.User).filter(
            models.User.username == username).first()
    except Exception as err:
        raise err
def get_user_by_email(db: Session, email: str):
    try:       
        return db.query(
            models.User).filter(
            models.User.email == email).first() 
    except Exception as err:
        raise err


def get_email_by_role(db: Session, role: str):
    try:
        dbrole = db.query(models.Roles).filter(models.Roles.role == role).first()
        roleid = dbrole.id
        result = db.query(models.User_Roles).filter(models.User_Roles.role_id == roleid).all()
        user=[]
        i = 0 
        while i < len(result):
            data = result[i]
            vr = data.user_id
            usr = get_user_by_id(db, vr)
            user.append(usr.email)
            i += 1
                 
        return user
    except Exception as err:
        raise err


def get_user_by_id(db: Session, id: int):
    try:
        return db.query(models.User).filter(models.User.id == id).first()
    except Exception as err:
        raise err



def create_init_user(db: Session, password: str):



    db_user = models.User(
        username=settings.INIT_USER.get("username"),
        fullname=settings.INIT_USER.get("fullname"),
        email=settings.INIT_USER.get("email"),
        created_at=datetime.datetime.now(),
        password=hashing_passwd(password)
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as err:
        raise err

def register_user(db:Session, user: schemas.UserRegister):
    db_user = models.User(
        username=user.username,
        fullname=user.fullname,
        email=user.email,
        created_at=datetime.datetime.now(),
        password=hashing_passwd(user.password)
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as err:
        raise err

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db_user.password = hashing_passwd(user.password)
    db_user.created_at = datetime.datetime.now()
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except exc.IntegrityError as err:
        raise ValueError(str(err.__dict__['orig']))
    except Exception as err:
        raise err


def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(
        models.User.id == user_id).first()
    db_user.updated_at = datetime.datetime.now()
    check_None = [None, "", "string"]
    if user.password not in check_None:
        db_user.password = hashing_passwd(user.password)
    if user.username not in check_None:
        db_user.username = user.username
    if user.email not in check_None:
        db_user.email = user.email
    if user.fullname not in check_None:
        db_user.fullname = user.fullname
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as err:
        raise err



def password_reset(db: Session, user_id: int, password: schemas.PasswordReset):
    db_user = db.query(models.User).filter(
        models.User.id == user_id).first()
    db_user.updated_at = datetime.datetime.now()

    check_None = [None, "", "string"]
    if password not in check_None:
        db_user.password = hashing_passwd(password.passwd)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as err:
        raise err


def delete_user_by_id(db: Session, id: int):
    db.query(models.User).filter(
        models.User.id == id).delete()
    try:
        db.commit()
        return {id: "deleted"}
    except Exception as err:
        raise err


def delete_user_by_name(db: Session, username: str):
    db.query(models.User).filter(
        models.User.username == username).delete()
    try:
        db.commit()
        return {username: "deleted"}
    except Exception as err:
        raise err


def check_username_password(db: Session, user: schemas.UserAuthenticate):
    db_user_info: models.User = get_user_by_username(
        db, username=user.username)
    try:
        return bcrypt.checkpw(
            user.password.encode('utf-8'),
            db_user_info.password.encode('utf-8'))
    except Exception as err:
        raise err


def get_users(db: Session):
    try:
        return db.query(models.User).all()
    except Exception as err:
        raise err