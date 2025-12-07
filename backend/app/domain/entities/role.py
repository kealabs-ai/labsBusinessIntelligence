from dataclasses import dataclass
from typing import Optional

@dataclass
class Role:
    role_id: Optional[int] = None
    name: str = ""
    description: Optional[str] = None

    def to_dict(self):
        return {
            'value': self.name,
            'label': self.name.title(),
            'description': self.description
        }