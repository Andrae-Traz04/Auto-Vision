from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(prefix="/audit-logs", tags=["audit-logs"])

@router.get("/", response_model=List[schemas.AuditLog])
def get_audit_logs(db: Session = Depends(database.get_db)):
    logs = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).all()
    for log in logs:
        log.time = log.timestamp.strftime('%m/%d/%Y, %I:%M:%S %p') if log.timestamp else ""
    return logs

@router.post("/", response_model=schemas.AuditLog)
def create_audit_log(log: schemas.AuditLogCreate, db: Session = Depends(database.get_db)):
    db_log = models.AuditLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    db_log.time = db_log.timestamp.strftime('%m/%d/%Y, %I:%M:%S %p') if db_log.timestamp else ""
    return db_log
