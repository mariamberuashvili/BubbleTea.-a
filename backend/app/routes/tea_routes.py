from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.tea import Tea
from app.schemas.tea_schemas import TeaCreate, TeaRead
from app.dependencies import require_admin_user 

router = APIRouter(prefix="/teas", tags=["Teas"])


@router.get("/", response_model=List[TeaRead])
def get_teas(db: Session = Depends(get_db)):
    return db.query(Tea).all()



@router.get("/{tea_id}", response_model=TeaRead)
def get_tea(tea_id: int, db: Session = Depends(get_db)):
    try:
        tea = db.query(Tea).filter(Tea.id == tea_id).first()
        if not tea:
            raise HTTPException(status_code=404, detail="Té no encontrado")
        return tea
    except HTTPException as he:
        raise he
    except Exception as e:
        print("ERROR BACKEND:", e)
        raise HTTPException(status_code=500, detail=str(e))


#  CREAR, ELIMINAR, EDITAR (Solo Admin)
@router.post("/", response_model=TeaRead, status_code=status.HTTP_201_CREATED)
def create_tea(
    tea: TeaCreate, 
    db: Session = Depends(get_db), 
    current_admin: dict = Depends(require_admin_user) 
):
    
    existing_tea = db.query(Tea).filter(Tea.name == tea.name).first()
    if existing_tea:
        raise HTTPException(status_code=400, detail="Ya existe un té con ese nombre")

    new_tea = Tea(**tea.dict())
    db.add(new_tea)
    db.commit()
    db.refresh(new_tea)
    return new_tea



@router.put("/{tea_id}", response_model=TeaRead)
def update_tea(
    tea_id: int, 
    tea_data: TeaCreate, 
    db: Session = Depends(get_db), 
    current_admin: dict = Depends(require_admin_user)
):
    tea = db.query(Tea).filter(Tea.id == tea_id).first()

    if not tea:
        raise HTTPException(status_code=404, detail="Té no encontrado")

    for key, value in tea_data.dict().items():
        setattr(tea, key, value)

    db.commit()
    db.refresh(tea)
    return tea



@router.delete("/{tea_id}")
def delete_tea(
    tea_id: int, 
    db: Session = Depends(get_db), 
    current_admin: dict = Depends(require_admin_user) # <-- Bloqueo Admin
):
    tea = db.query(Tea).filter(Tea.id == tea_id).first()

    if not tea:
        raise HTTPException(status_code=404, detail="Té no encontrado")

    db.delete(tea)
    db.commit()
    return {"message": f"El té '{tea.name}' ha sido eliminado correctamente"}