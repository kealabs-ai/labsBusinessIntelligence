from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from application.services.resource_service import ResourceService
from application.services.token_manager import TokenManager
from domain.entities.resource import Resource, ResourceCreate, ResourceUpdate

router = APIRouter()
resource_service = ResourceService()
token_manager = TokenManager()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token_data = token_manager.verify_token(credentials.credentials)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token_data

@router.get("/", response_model=List[Resource])
def get_all_resources(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    print(f"Getting resources for user_id: {user_id}")
    resources = resource_service.get_all_resources(user_id)
    print(f"Found {len(resources)} resources")
    return resources

@router.get("/{resource_id}", response_model=Resource)
def get_resource(resource_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    resource = resource_service.get_resource_by_id(resource_id, user_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.post("/", response_model=Resource, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceCreate, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.get("user_id")
        return resource_service.create_resource(resource, user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{resource_id}/update", response_model=Resource)
def update_resource(resource_id: int, resource_update: ResourceUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    updated_resource = resource_service.update_resource(resource_id, resource_update, user_id)
    if not updated_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return updated_resource

@router.post("/{resource_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    resource = resource_service.get_resource_by_id(resource_id, user_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource_service.delete_resource(resource_id, user_id)
    return

@router.get("/type/{resource_type}", response_model=List[Resource])
def get_resources_by_type(resource_type: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if resource_type not in ['professional', 'equipment', 'room']:
        raise HTTPException(status_code=400, detail="Invalid resource type")
    return resource_service.get_resources_by_type(resource_type, user_id)