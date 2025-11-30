#!/usr/bin/env python3
"""
Test script to verify API endpoints are working
"""
import requests
import json

BASE_URL = "http://72.60.140.128:6002/api/v1"

def test_endpoint(url, method="GET", headers=None, data=None):
    """Test an API endpoint"""
    try:
        print(f"\nTesting {method} {url}")
        
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print(f"SUCCESS: {response.json()}")
        else:
            print(f"ERROR: {response.text}")
            
    except Exception as e:
        print(f"EXCEPTION: {str(e)}")

def main():
    print("Testing LabsBusinessIntelligence API Endpoints")
    print("=" * 50)
    
    # Test basic connectivity
    test_endpoint(f"{BASE_URL}/../")
    
    # Test agendamentos endpoints
    test_endpoint(f"{BASE_URL}/agendamentos/test")
    test_endpoint(f"{BASE_URL}/agendamentos")
    
    # Test contacts endpoints  
    test_endpoint(f"{BASE_URL}/contacts/test")
    test_endpoint(f"{BASE_URL}/contacts")
    
    # Test clients endpoints
    test_endpoint(f"{BASE_URL}/clients/test")
    test_endpoint(f"{BASE_URL}/clients")
    
    print("\n" + "=" * 50)
    print("Test completed")

if __name__ == "__main__":
    main()