#!/usr/bin/env python3
"""
Test script for user management endpoints
"""
import requests
import json

BASE_URL = "http://72.60.140.128:6002/api/v1"

def test_login():
    """Test login to get admin token"""
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        data = response.json()
        print("✅ Login successful")
        return data["access_token"]
    else:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        return None

def test_get_roles(token):
    """Test get roles endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/roles", headers=headers)
    if response.status_code == 200:
        roles = response.json()
        print(f"✅ Roles retrieved: {len(roles)} roles found")
        for role in roles:
            print(f"   - {role['label']} (ID: {role['value']})")
        return True
    else:
        print(f"❌ Get roles failed: {response.status_code} - {response.text}")
        return False

def test_create_user(token):
    """Test create user endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    
    user_data = {
        "username": "test_user",
        "email": "test@example.com",
        "password": "test123",
        "role": "4",
        "kea_client_id": "DEFAULT_KEA_CLIENT"
    }
    
    response = requests.post(f"{BASE_URL}/admin/users", json=user_data, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ User created successfully: {data.get('message', 'Success')}")
        return data.get('data', {}).get('id')
    else:
        print(f"❌ Create user failed: {response.status_code} - {response.text}")
        return None

def test_get_users(token):
    """Test get users endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Users retrieved: {data['total']} total users")
        return True
    else:
        print(f"❌ Get users failed: {response.status_code} - {response.text}")
        return False

def test_update_user(token, user_id):
    """Test update user endpoint"""
    if not user_id:
        print("⚠️  Skipping update test - no user ID")
        return False
        
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "email": "updated_test@example.com",
        "role": "3"
    }
    
    response = requests.put(f"{BASE_URL}/admin/users/{user_id}", json=update_data, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ User updated successfully: {data.get('message', 'Success')}")
        return True
    else:
        print(f"❌ Update user failed: {response.status_code} - {response.text}")
        return False

def test_delete_user(token, user_id):
    """Test delete user endpoint"""
    if not user_id:
        print("⚠️  Skipping delete test - no user ID")
        return False
        
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.delete(f"{BASE_URL}/admin/users/{user_id}", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ User deleted successfully: {data.get('message', 'Success')}")
        return True
    else:
        print(f"❌ Delete user failed: {response.status_code} - {response.text}")
        return False

def main():
    print("🧪 Testing User Management Endpoints")
    print("=" * 50)
    
    # Test login
    token = test_login()
    if not token:
        print("❌ Cannot proceed without valid token")
        return
    
    print()
    
    # Test get roles
    test_get_roles(token)
    print()
    
    # Test get users
    test_get_users(token)
    print()
    
    # Test create user
    user_id = test_create_user(token)
    print()
    
    # Test update user
    test_update_user(token, user_id)
    print()
    
    # Test delete user
    test_delete_user(token, user_id)
    print()
    
    print("🏁 Test completed!")

if __name__ == "__main__":
    main()