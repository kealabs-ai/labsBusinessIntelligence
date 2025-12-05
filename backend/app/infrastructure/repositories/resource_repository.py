from typing import List, Optional
from ..database.factory import get_repository
from ...domain.entities.resource import Resource, ResourceCreate, ResourceUpdate

class ResourceRepository:
    def __init__(self):
        self.repository = get_repository()

    def get_all(self, user_id: int) -> List[Resource]:
        query = "SELECT * FROM resources WHERE user_id = %s ORDER BY created_at DESC"
        params = (user_id,)
        result = self.repository.fetchall(query, params)
        return [Resource(**row) for row in result] if result else []

    def get_by_id(self, resource_id: int, user_id: int) -> Optional[Resource]:
        query = "SELECT * FROM resources WHERE id = %s AND user_id = %s"
        params = (resource_id, user_id)
        row = self.repository.fetchone(query, params)
        return Resource(**row) if row else None

    def create(self, resource: ResourceCreate, user_id: int) -> Resource:
        query = """
            INSERT INTO resources (user_id, name, type, specialty, email, phone, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            user_id,
            resource.name,
            resource.type,
            resource.specialty,
            resource.email,
            resource.phone,
            resource.notes,
            resource.status
        )
        resource_id = self.repository.execute(query, params)
        return self.get_by_id(resource_id, user_id)

    def update(self, resource_id: int, resource_update: ResourceUpdate, user_id: int) -> Optional[Resource]:
        query_parts = []
        params = []
        
        if resource_update.name is not None:
            query_parts.append("name = %s")
            params.append(resource_update.name)
        if resource_update.type is not None:
            query_parts.append("type = %s")
            params.append(resource_update.type)
        if resource_update.specialty is not None:
            query_parts.append("specialty = %s")
            params.append(resource_update.specialty)
        if resource_update.email is not None:
            query_parts.append("email = %s")
            params.append(resource_update.email)
        if resource_update.phone is not None:
            query_parts.append("phone = %s")
            params.append(resource_update.phone)
        if resource_update.notes is not None:
            query_parts.append("notes = %s")
            params.append(resource_update.notes)
        if resource_update.status is not None:
            query_parts.append("status = %s")
            params.append(resource_update.status)

        if not query_parts:
            return self.get_by_id(resource_id, user_id)

        query = f"UPDATE resources SET {', '.join(query_parts)} WHERE id = %s AND user_id = %s"
        params.extend([resource_id, user_id])
        
        self.repository.execute(query, tuple(params))
        return self.get_by_id(resource_id, user_id)

    def delete(self, resource_id: int, user_id: int) -> None:
        query = "DELETE FROM resources WHERE id = %s AND user_id = %s"
        params = (resource_id, user_id)
        self.repository.execute(query, params)

    def get_by_type(self, resource_type: str, user_id: int) -> List[Resource]:
        query = "SELECT * FROM resources WHERE type = %s AND user_id = %s AND status = 1 ORDER BY name"
        params = (resource_type, user_id)
        result = self.repository.fetchall(query, params)
        return [Resource(**row) for row in result] if result else []