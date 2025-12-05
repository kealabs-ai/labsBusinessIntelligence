from typing import List, Optional
from infrastructure.repositories.mysql_repository import MySQLResourceRepository
from domain.entities.resource import Resource, ResourceCreate, ResourceUpdate

class ResourceRepository:
    def __init__(self):
        self.repository = MySQLResourceRepository()

    def get_all(self, user_id: int) -> List[Resource]:
        try:
            query = "SELECT * FROM resources WHERE user_id = %s ORDER BY id DESC"
            params = (user_id,)
            result = self.repository.fetchall(query, params)
            print(f"Query result for user {user_id}: {result}")
            if result:
                resources = []
                for row in result:
                    try:
                        resource = Resource(**row)
                        resources.append(resource)
                    except Exception as e:
                        print(f"Error creating resource from row {row}: {e}")
                return resources
            return []
        except Exception as e:
            print(f"Error in get_all: {e}")
            return []

    def get_by_id(self, resource_id: int, user_id: int) -> Optional[Resource]:
        query = "SELECT * FROM resources WHERE id = %s AND user_id = %s"
        params = (resource_id, user_id)
        row = self.repository.fetchone(query, params)
        return Resource(**row) if row else None

    def create(self, resource: ResourceCreate, user_id: int) -> Resource:
        try:
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
                resource.status if hasattr(resource, 'status') else True,
            )
            resource_id = self.repository.execute(query, params)
            return self.get_by_id(resource_id, user_id)
        except Exception as e:
            print(f"Error creating resource: {e}")
            raise e

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