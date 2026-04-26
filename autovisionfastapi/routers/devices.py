from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("/", response_model=List[schemas.Device])
def get_devices(db: Session = Depends(database.get_db)):
    devices = db.query(models.Device).all()
    for d in devices:
        d.deviceId = d.device_id
    return devices

@router.post("/", response_model=schemas.Device)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(database.get_db)):
    db_device = models.Device(name=device.name, location=device.location, status=device.status, device_id=device.deviceId)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    db_device.deviceId = db_device.device_id
    return db_device

@router.delete("/{device_id}/")
def delete_device(device_id: int, db: Session = Depends(database.get_db)):
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(db_device)
    db.commit()
    return {"ok": True}

@router.patch("/{device_id}/", response_model=schemas.Device)
def update_device(device_id: int, device_update: dict, db: Session = Depends(database.get_db)):
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if "status" in device_update:
        db_device.status = device_update["status"]
    
    db.commit()
    db.refresh(db_device)
    db_device.deviceId = db_device.device_id
    return db_device
