#!/usr/bin/env python3
"""
Script de teste para validar as correções no sistema de usuários
"""

import requests
import json
import sys

# Configuração da API
BASE_URL = "http://localhost:6000"  # Ajuste conforme necessário
LOGIN_URL = f"{BASE_URL}/auth/login"
USERS_URL = f"{BASE_URL}/admin/users"

def test_user_creation():
    """Testa a criação de usuário com os novos campos"""
    
    # 1. Fazer login como admin
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    print("1. Fazendo login...")
    response = requests.post(LOGIN_URL, data=login_data)
    if response.status_code != 200:
        print(f"❌ Erro no login: {response.status_code}")
        return False
    
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Criar usuário com os novos campos
    user_data = {
        "name": "João Silva",
        "username": "joao.silva",
        "email": "joao.silva@teste.com",
        "password": "senha123",
        "role": "4"
    }
    
    print("2. Criando usuário...")
    response = requests.post(USERS_URL, json=user_data, headers=headers)
    
    if response.status_code == 200:
        print("✅ Usuário criado com sucesso!")
        user = response.json()
        print(f"   ID: {user.get('id')}")
        print(f"   Nome: {user.get('name')}")
        print(f"   Username: {user.get('username')}")
        print(f"   Email: {user.get('email')}")
        return True
    else:
        print(f"❌ Erro ao criar usuário: {response.status_code}")
        print(f"   Resposta: {response.text}")
        return False

def test_user_validation():
    """Testa as validações dos campos obrigatórios"""
    
    # Fazer login
    login_data = {"username": "admin", "password": "admin123"}
    response = requests.post(LOGIN_URL, data=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Teste 1: Usuário sem nome
    print("3. Testando validação - usuário sem nome...")
    user_data = {
        "username": "teste.sem.nome",
        "email": "teste@teste.com",
        "password": "senha123",
        "role": "4"
    }
    
    response = requests.post(USERS_URL, json=user_data, headers=headers)
    if response.status_code == 400:
        print("✅ Validação funcionando - nome obrigatório")
    else:
        print("❌ Validação falhou - nome deveria ser obrigatório")
    
    # Teste 2: Usuário sem email
    print("4. Testando validação - usuário sem email...")
    user_data = {
        "name": "Teste Sem Email",
        "username": "teste.sem.email",
        "password": "senha123",
        "role": "4"
    }
    
    response = requests.post(USERS_URL, json=user_data, headers=headers)
    if response.status_code == 400:
        print("✅ Validação funcionando - email obrigatório")
    else:
        print("❌ Validação falhou - email deveria ser obrigatório")

def test_user_listing():
    """Testa a listagem de usuários com o campo nome"""
    
    # Fazer login
    login_data = {"username": "admin", "password": "admin123"}
    response = requests.post(LOGIN_URL, data=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print("5. Testando listagem de usuários...")
    response = requests.get(USERS_URL, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        users = data.get("users", [])
        print(f"✅ Listagem funcionando - {len(users)} usuários encontrados")
        
        for user in users[:3]:  # Mostrar apenas os 3 primeiros
            print(f"   - {user.get('name', 'N/A')} ({user.get('username')}) - {user.get('email')}")
        
        return True
    else:
        print(f"❌ Erro na listagem: {response.status_code}")
        return False

if __name__ == "__main__":
    print("🧪 Iniciando testes do sistema de usuários...")
    print("=" * 50)
    
    success = True
    
    try:
        success &= test_user_creation()
        test_user_validation()
        success &= test_user_listing()
        
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão - verifique se o backend está rodando")
        success = False
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        success = False
    
    print("=" * 50)
    if success:
        print("✅ Todos os testes principais passaram!")
    else:
        print("❌ Alguns testes falharam - verifique os logs acima")
    
    sys.exit(0 if success else 1)