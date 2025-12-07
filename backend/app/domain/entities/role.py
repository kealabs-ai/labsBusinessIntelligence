from dataclasses import dataclass
from typing import Optional

@dataclass
class Role:
    role_id: Optional[int] = None
    name: str = ""
    description: Optional[str] = None

    def to_dict(self):
        return {
            'value': str(self.role_id),
            'label': self.name,
            'description': self.description
        }