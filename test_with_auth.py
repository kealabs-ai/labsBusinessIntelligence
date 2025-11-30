#!/usr/bin/env python3
"""
Test script with authentication to verify API endpoints
"""
import requests
import json

BASE_URL = "http://72.60.140.128:6002/api/v1"

def get_auth_token():
    """Get authentication token"""
    try:
        login_url = f"{BASE_URL}/auth/login"
        # You'll need to provide valid credentials
        credentials = {
            "username": "admin",  # Replace with actual username
            "password": "admin"   # Replace with actual password
        }
        
        response = requests.post(login_url, json=credentials, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {str(e)}")
        return None

def test_with_auth():
    """Test endpoints with authentication"""
    print("Getting authentication token...")
    token = get_auth_token()
    
    if not token:
        print("Could not get authentication token")
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"Token obtained: {token[:20]}...")
    
    # Test authenticated endpoints
    endpoints = [
        f"{BASE_URL}/agendamentos",
        f"{BASE_URL}/contacts", 
        f"{BASE_URL}/clients"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"\nTesting {endpoint}")
            response = requests.get(endpoint, headers=headers, timeout=10)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"SUCCESS: {json.dumps(data, indent=2)[:200]}...")
            else:
                print(f"ERROR: {response.text}")
        except Exception as e:
            print(f"EXCEPTION: {str(e)}")

if __name__ == "__main__":
    test_with_auth()