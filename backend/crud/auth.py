from sqlalchemy.orm import Session

import db.models as models
from Security.tokens import get_password_hash
from db.models import Reset_Code
import datetime

hashing_passwd = get_password_hash

#=====================================================================
# FORGOT PASSWORD START


def create_reset_code(db: Session,email:str, reset_code:str, status:str):
    
    db_code =  models.Reset_Code(
        email = email,
        reset_code = reset_code,
        expired_in = datetime.datetime.now())
        
    try:
        print("Data inserted")
        db.add(db_code)
        db.commit()
        db.refresh(db_code)
        return db_code.email,db_code.reset_code
    except Exception as err:
        raise err

def check_reset_password_token(db: Session, reset_password_token: str):
    #Check Token and return email
    try:
        records = db.query(Reset_Code).filter(Reset_Code.reset_code == reset_password_token).first()
        
        if not records:
            return records

        else  :  
            exp_time = records.expired_in
            time_now = datetime.datetime.now()

            # Convert Variable-Type Date into Int.     
            int_time_now = time_now.year*10000000000 + time_now.month * 100000000 + time_now.day * 1000000 + time_now.hour*10000 + time_now.minute*100 + time_now.second
            int_time_exp = exp_time.year*10000000000 + exp_time.month * 100000000 + exp_time.day * 1000000 + exp_time.hour*10000 + exp_time.minute*100 + exp_time.second
            
            t_limit = int_time_now - int_time_exp

            if t_limit <= 300: # Time in Seconds (5-minutes = 300-Seconds)
                return records
    
    except Exception as err:
        raise err

def reset_password(db:Session,new_password: str, email:str):
    db_res_pass = db.query(models.User).filter(models.User.email == email).first()
    db_res_pass.updated_at = datetime.datetime.now()
    check_None = [None, "", "string"]
    if new_password not in check_None:
        db_res_pass.password = hashing_passwd(new_password)
    try:
        db.add(db_res_pass)
        db.commit()
        db.refresh(db_res_pass)
        return db_res_pass
    except Exception as err:
        raise err

def disable_reset_code(db:Session, reset_password_token:str ,email:str):
    db_res_code = db.query(Reset_Code).filter(Reset_Code.reset_code == reset_password_token, Reset_Code.email == email).first()
    try:
        db.add(db_res_code)
        db.commit()
        db.refresh(db_res_code)
        return db_res_code
    except Exception as err:
        raise err