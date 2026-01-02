from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from domain.entities.service import Service, ServiceCreate, ServiceUpdate
from application.services.service_service import ServiceService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

class ServiceCreateRequest(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    price: Decimal
    duration: int
    status: bool = True
    unit_id: Optional[int] = None
    kea_client_id: Optional[str] = None
    role_id: Optional[int] = None

class ServiceUpdateRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    duration: Optional[int] = None
    status: Optional[bool] = None

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user.id

@router.post("/", response_model=Service)
async def create_service(
    request: ServiceCreateRequest,
    user_id: int = Depends(get_current_user_id)
):
    service_service = ServiceService()
    service = Service(
        user_id=user_id,
        name=request.name,
        category=request.category,
        description=request.description,
        price=request.price,
        duration=request.duration,
        status=request.status,
        unit_id=request.unit_id,
        kea_client_id=request.kea_client_id,
        role_id=request.role_id
    )
    return await service_service.create_service(service)

@router.get("/categories", response_model=List[str])
async def get_service_categories(user_id: int = Depends(get_current_user_id)):
    service_service = ServiceService()
    return await service_service.get_service_categories()

@router.get("/", response_model=List[Service])
async def get_services(user_id: int = Depends(get_current_user_id)):
    service_service = ServiceService()
    return await service_service.get_services_by_user(user_id)

@router.get("/{service_id}", response_model=Service)
async def get_service(
    service_id: int,
    user_id: int = Depends(get_current_user_id)
):
    service_service = ServiceService()
    service = await service_service.get_service_by_id(service_id)
    
    if not service or service.user_id != user_id:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return service

@router.post("/{service_id}/update", response_model=Service)
async def update_service(
    service_id: int,
    request: ServiceUpdateRequest,
    user_id: int = Depends(get_current_user_id)
):
    service_service = ServiceService()
    
    existing_service = await service_service.get_service_by_id(service_id)
    if not existing_service or existing_service.user_id != user_id:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service = Service(
        service_id=service_id,
        user_id=user_id,
        name=request.name or existing_service.name,
        category=request.category or existing_service.category,
        description=request.description if request.description is not None else existing_service.description,
        price=request.price or existing_service.price,
        duration=request.duration or existing_service.duration,
        status=request.status if request.status is not None else existing_service.status
    )
    
    updated_service = await service_service.update_service(service_id, service)
    if not updated_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return updated_service

@router.post("/{service_id}/status", response_model=dict)
async def update_service_status(
    service_id: int,
    request: dict,
    user_id: int = Depends(get_current_user_id)
):
    service_service = ServiceService()
    
    existing_service = await service_service.get_service_by_id(service_id)
    if not existing_service or existing_service.user_id != user_id:
        raise HTTPException(status_code=404, detail="Service not found")
    
    success = await service_service.update_service_status(service_id, request.get("status", True))
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {"message": "Service status updated successfully"}