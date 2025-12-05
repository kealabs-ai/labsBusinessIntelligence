import requests
import json

# Configuration
BASE_URL = "http://72.60.140.128:6002/api/v1/resources"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzY0OTQ4MzI5LCJpc19hY3RpdmUiOnRydWUsInJvbGUiOiJhZG1pbiJ9.OqJIF6_SJhQQRkOUG-lQlAUHYNZNj5jdE2i3KJwuQZ4"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def test_get_resources():
    print("Testing GET /resources")
    response = requests.get(BASE_URL, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

def test_create_resource():
    print("Testing POST /resources")
    data = {
        "name": "Test Resource",
        "type": "professional",
        "specialty": "Testing",
        "email": "test@example.com",
        "phone": "123456789",
        "notes": "Test notes"
    }
    response = requests.post(BASE_URL, headers=headers, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)
    return response.json() if response.status_code == 201 else None

def test_get_resource_by_id(resource_id):
    print(f"Testing GET /resources/{resource_id}")
    response = requests.get(f"{BASE_URL}/{resource_id}", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

def test_update_resource(resource_id):
    print(f"Testing PUT /resources/{resource_id}")
    data = {
        "name": "Updated Resource",
        "specialty": "Updated Testing"
    }
    response = requests.put(f"{BASE_URL}/{resource_id}", headers=headers, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

def test_delete_resource(resource_id):
    print(f"Testing DELETE /resources/{resource_id}")
    response = requests.delete(f"{BASE_URL}/{resource_id}", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

if __name__ == "__main__":
    # Test GET all resources
    test_get_resources()
    
    # Test CREATE resource
    created_resource = test_create_resource()
    
    if created_resource and 'id' in created_resource:
        resource_id = created_resource['id']
        
        # Test GET by ID
        test_get_resource_by_id(resource_id)
        
        # Test UPDATE
        test_update_resource(resource_id)
        
        # Test GET all again to see changes
        test_get_resources()
        
        # Test DELETE
        test_delete_resource(resource_id)
        
        # Test GET all again to confirm deletion
        test_get_resources()
    else:
        print("Could not create resource for further testing")