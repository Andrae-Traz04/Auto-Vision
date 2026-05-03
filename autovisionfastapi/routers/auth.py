from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.hash import django_pbkdf2_sha256
from .. import models, schemas, database

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register/")
def register_user(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.AuthUser).filter(models.AuthUser.username == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = django_pbkdf2_sha256.hash(user.password)
    
    new_user = models.AuthUser(
        username=user.email,
        email=user.email,
        password=hashed_password,
        is_superuser=0,
        is_staff=0,
        is_active=1
    )
    db.add(new_user)
    db.commit()
    return {"message": "Success"}

@router.post("/login/")
def login_user(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.AuthUser).filter(models.AuthUser.username == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        if not django_pbkdf2_sha256.verify(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return {"message": "Success", "user": db_user.username}
