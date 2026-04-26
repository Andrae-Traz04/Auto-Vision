from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.SystemUser])
def get_users(db: Session = Depends(database.get_db)):
    return db.query(models.SystemUser).all()

@router.post("/", response_model=schemas.SystemUser)
def create_user(user: schemas.SystemUserCreate, db: Session = Depends(database.get_db)):
    db_user = models.SystemUser(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}/")
def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = db.query(models.SystemUser).filter(models.SystemUser.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"ok": True}

@router.patch("/{user_id}/", response_model=schemas.SystemUser)
def update_user(user_id: int, user_update: dict, db: Session = Depends(database.get_db)):
    db_user = db.query(models.SystemUser).filter(models.SystemUser.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "role" in user_update:
        db_user.role = user_update["role"]
    
    db.commit()
    db.refresh(db_user)
    return db_user
