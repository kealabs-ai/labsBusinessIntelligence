from typing import List
from domain.entities.role import Role
from infrastructure.repositories.role_repository import RoleRepository

class RoleService:
    def __init__(self):
        self.role_repository = RoleRepository()

    def get_all_roles(self) -> List[Role]:
        return self.role_repository.get_all_roles()