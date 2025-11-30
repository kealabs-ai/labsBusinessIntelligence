#!/usr/bin/env python3
"""
Debug script to check route registration
"""
from main import app

def debug_routes():
    print("=== Registered Routes ===")
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            print(f"{list(route.methods)} {route.path}")
        elif hasattr(route, 'path'):
            print(f"[NO METHODS] {route.path}")
    print("========================")

if __name__ == "__main__":
    debug_routes()