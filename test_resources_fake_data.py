import requests
import json

# Configuration
BASE_URL = "http://72.60.140.128:6002/api/v1/resources"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzY0OTQ4MzI5LCJpc19hY3RpdmUiOnRydWUsInJvbGUiOiJhZG1pbiJ9.OqJIF6_SJhQQRkOUG-lQlAUHYNZNj5jdE2i3KJwuQZ4"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Fake test data
fake_resources = [
    {
        "name": "Dr. João Silva",
        "type": "professional",
        "specialty": "Cardiologia",
        "email": "joao.silva@hospital.com",
        "phone": "(11) 99999-1111",
        "notes": "Especialista em cardiologia com 15 anos de experiência"
    },
    {
        "name": "Equipamento de Raio-X",
        "type": "equipment",
        "specialty": "Radiologia",
        "email": "",
        "phone": "",
        "notes": "Equipamento de última geração para exames de raio-x"
    },
    {
        "name": "Sala de Cirurgia 01",
        "type": "room",
        "specialty": "Cirurgia Geral",
        "email": "",
        "phone": "",
        "notes": "Sala equipada para cirurgias de grande porte"
    }
]

def test_get_resources():
    print("=== Testing GET /resources ===")
    response = requests.get(BASE_URL, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)
    return response.json() if response.status_code == 200 else []

def test_create_resource(data):
    print(f"=== Testing POST /resources - Creating: {data['name']} ===")
    response = requests.post(BASE_URL, headers=headers, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)
    return response.json() if response.status_code == 201 else None

def test_update_resource(resource_id):
    print(f"=== Testing POST /resources/{resource_id}/update ===")
    data = {
        "name": "Updated Resource Name",
        "specialty": "Updated Specialty",
        "notes": "Updated notes with new information"
    }
    response = requests.post(f"{BASE_URL}/{resource_id}/update", headers=headers, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

def test_delete_resource(resource_id):
    print(f"=== Testing POST /resources/{resource_id}/delete ===")
    response = requests.post(f"{BASE_URL}/{resource_id}/delete", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

if __name__ == "__main__":
    print("Starting Resources API Test with Fake Data")
    print("=" * 60)
    
    # Test GET all resources (initial state)
    initial_resources = test_get_resources()
    
    # Create fake resources
    created_resources = []
    for fake_data in fake_resources:
        created_resource = test_create_resource(fake_data)
        if created_resource:
            created_resources.append(created_resource)
    
    # Test GET all resources after creation
    print("=== Resources after creation ===")
    all_resources = test_get_resources()
    
    # Test update first created resource
    if created_resources:
        first_resource_id = created_resources[0]['id']
        test_update_resource(first_resource_id)
        
        # Get resources after update
        print("=== Resources after update ===")
        test_get_resources()
        
        # Test delete last created resource
        if len(created_resources) > 1:
            last_resource_id = created_resources[-1]['id']
            test_delete_resource(last_resource_id)
            
            # Get resources after deletion
            print("=== Resources after deletion ===")
            test_get_resources()
    
    print("Test completed!")