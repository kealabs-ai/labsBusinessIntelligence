import requests

# Test if clients endpoint is accessible
try:
    response = requests.get('http://72.60.140.128:6002/api/v1/clients/test')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

# Test root endpoint
try:
    response = requests.get('http://72.60.140.128:6002/')
    print(f"Root Status: {response.status_code}")
    print(f"Root Response: {response.text}")
except Exception as e:
    print(f"Root Error: {e}")