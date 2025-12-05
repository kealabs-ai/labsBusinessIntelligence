from typing import List, Optional
from infrastructure.repositories.resource_repository import ResourceRepository
from domain.entities.resource import Resource, ResourceCreate, ResourceUpdate

class ResourceService:
    def __init__(self):
        self.resource_repository = ResourceRepository()

    def get_all_resources(self, user_id: int) -> List[Resource]:
        return self.resource_repository.get_all(user_id)

    def get_resource_by_id(self, resource_id: int, user_id: int) -> Optional[Resource]:
        return self.resource_repository.get_by_id(resource_id, user_id)

    def create_resource(self, resource: ResourceCreate, user_id: int) -> Resource:
        return self.resource_repository.create(resource, user_id)

    def update_resource(self, resource_id: int, resource_update: ResourceUpdate, user_id: int) -> Optional[Resource]:
        return self.resource_repository.update(resource_id, resource_update, user_id)

    def delete_resource(self, resource_id: int, user_id: int) -> None:
        self.resource_repository.delete(resource_id, user_id)

    def get_resources_by_type(self, resource_type: str, user_id: int) -> List[Resource]:
        return self.resource_repository.get_by_type(resource_type, user_id)