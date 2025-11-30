import json
from typing import Dict, Any
import mysql.connector
from pathlib import Path
from dotenv import load_dotenv
from infrastructure.config.env_manager import env

try:
    import pyodbc
    PYODBC_AVAILABLE = True
except ImportError:
    PYODBC_AVAILABLE = False

class DatabaseConfigService:
    def __init__(self):
        # O arquivo .env está na pasta backend
        self.env_file_path = Path(__file__).parent.parent.parent / '.env'
        # Carregar o arquivo .env
        load_dotenv(self.env_file_path)
        
    def get_configurations(self) -> Dict[str, Any]:
        """Retorna as configurações atuais do banco de dados"""
        try:
            # Forçar reload do .env
            load_dotenv(self.env_file_path, override=True)
            
            db_config = env.get_database_config()
            mysql_config = {
                'host': db_config['host'],
                'port': str(db_config['port']),
                'user': env.get('MYSQL_USER', ''),
                'password': '***',  # Não expor senha
                'database': db_config['database']
            }

            sqlserver_config = {
                'host': env.get('SQLSERVER_HOST', ''),
                'port': env.get('SQLSERVER_PORT', '1433'),
                'user': env.get('SQLSERVER_USER', ''),
                'password': '***',  # Não expor senha
                'database': env.get('SQLSERVER_DATABASE', ''),
                'driver': env.get('SQLSERVER_DRIVER', '{ODBC Driver 18 for SQL Server}')
            }
            
            environment_config = {
                'dbEngine': env.get('DB_ENGINE', 'mysql'),
                'environment': env.get('ENVIRONMENT', 'dev'),
                'port': env.get('PORT', '6002'),
                'secretKey': '***',  # Não expor chave secreta
                'evolutionApiUrl': env.get('URL_EVOLUTION_API', ''),
                'evolutionInstance': env.get('INSTANCE', ''),
                'evolutionApiKey': '***'  # Não expor API key
            }
            
            openvpn_config = {
                'server': env.get('OPENVPN_SERVER', ''),
                'port': env.get('OPENVPN_PORT', '1194'),
                'protocol': env.get('OPENVPN_PROTOCOL', 'udp'),
                'username': env.get('OPENVPN_USERNAME', ''),
                'password': '***',  # Não expor senha
                'caCert': env.get('OPENVPN_CA_CERT', ''),
                'additionalConfig': env.get('OPENVPN_ADDITIONAL_CONFIG', '')
            }
            
            result = {
                'mysql': mysql_config,
                'sqlserver': sqlserver_config,
                'environment': environment_config,
                'openvpn': openvpn_config
            }
            
            return result
        except Exception as e:
            raise Exception(f"Erro ao carregar configurações: {str(e)}")
    
    def test_mysql_connection(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Testa a conexão com MySQL"""
        try:
            connection = mysql.connector.connect(
                host=config['host'],
                port=int(config['port']),
                user=config['user'],
                password=config['password'],
                database=config['database']
            )
            connection.close()
            return {'success': True, 'message': 'Conexão MySQL realizada com sucesso!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro na conexão MySQL: {str(e)}'}
    
    def test_sqlserver_connection(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Testa a conexão com SQL Server"""
        if not PYODBC_AVAILABLE:
            return {'success': False, 'message': 'Driver SQL Server não disponível no sistema'}
        
        try:
            connection_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={config['host']},{config['port']};DATABASE={config['database']};UID={config['user']};PWD={config['password']}"
            connection = pyodbc.connect(connection_string)
            connection.close()
            return {'success': True, 'message': 'Conexão SQL Server realizada com sucesso!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro na conexão SQL Server: {str(e)}'}
    
    def test_environment_config(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Valida as configurações de ambiente"""
        try:
            required_fields = ['dbEngine', 'environment', 'port', 'secretKey']
            missing_fields = [field for field in required_fields if not config.get(field)]
            
            if missing_fields:
                return {'success': False, 'message': f'Campos obrigatórios não preenchidos: {", ".join(missing_fields)}'}
            
            return {'success': True, 'message': 'Configurações de ambiente válidas!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro na validação: {str(e)}'}
    
    def _update_env_file(self, updates: Dict[str, str]) -> None:
        """Atualiza o arquivo .env com novas configurações"""
        try:
            # Lê o arquivo .env atual
            env_content = {}
            if self.env_file_path.exists():
                with open(self.env_file_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            env_content[key] = value
            
            # Atualiza com os novos valores
            env_content.update(updates)
            
            # Escreve o arquivo .env atualizado
            with open(self.env_file_path, 'w') as f:
                for key, value in env_content.items():
                    f.write(f"{key}={value}\n")
                    
        except Exception as e:
            raise Exception(f"Erro ao atualizar arquivo .env: {str(e)}")
    
    def save_mysql_config(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Salva a configuração MySQL"""
        try:
            updates = {
                'MYSQL_HOST': config['host'],
                'MYSQL_PORT': config['port'],
                'MYSQL_USER': config['user'],
                'MYSQL_PASSWORD': config['password'],
                'MYSQL_DATABASE': config['database']
            }
            self._update_env_file(updates)
            return {'success': True, 'message': 'Configuração MySQL salva com sucesso!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro ao salvar configuração MySQL: {str(e)}'}
    
    def save_sqlserver_config(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Salva a configuração SQL Server"""
        try:
            updates = {
                'SQLSERVER_HOST': config['host'],
                'SQLSERVER_PORT': config['port'],
                'SQLSERVER_USER': config['user'],
                'SQLSERVER_PASSWORD': config['password'],
                'SQLSERVER_DATABASE': config['database'],
                'SQLSERVER_DRIVER': config['driver']
            }
            self._update_env_file(updates)
            return {'success': True, 'message': 'Configuração SQL Server salva com sucesso!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro ao salvar configuração SQL Server: {str(e)}'}
    
    def save_environment_config(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Salva as configurações de ambiente"""
        try:
            updates = {
                'DB_ENGINE': config['dbEngine'],
                'ENVIRONMENT': config['environment'],
                'PORT': config['port'],
                'SECRET_KEY': config['secretKey'],
                'URL_EVOLUTION_API': config['evolutionApiUrl'],
                'INSTANCE': config['evolutionInstance'],
                'API_KEY': config['evolutionApiKey']
            }
            self._update_env_file(updates)
            return {'success': True, 'message': 'Configurações de ambiente salvas com sucesso!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro ao salvar configurações de ambiente: {str(e)}'}
    
    def test_openvpn_connection(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Testa a configuração OpenVPN"""
        try:
            required_fields = ['server', 'port', 'protocol']
            missing_fields = [field for field in required_fields if not config.get(field)]
            
            if missing_fields:
                return {'success': False, 'message': f'Campos obrigatórios não preenchidos: {", ".join(missing_fields)}'}
            
            # Validação básica de porta
            try:
                port = int(config['port'])
                if port < 1 or port > 65535:
                    return {'success': False, 'message': 'Porta deve estar entre 1 e 65535'}
            except ValueError:
                return {'success': False, 'message': 'Porta deve ser um número válido'}
            
            # Validação de protocolo
            if config['protocol'].lower() not in ['udp', 'tcp']:
                return {'success': False, 'message': 'Protocolo deve ser UDP ou TCP'}
            
            return {'success': True, 'message': 'Configurações OpenVPN válidas!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro na validação OpenVPN: {str(e)}'}
    
    def save_openvpn_config(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Salva a configuração OpenVPN"""
        try:
            updates = {
                'OPENVPN_SERVER': config['server'],
                'OPENVPN_PORT': config['port'],
                'OPENVPN_PROTOCOL': config['protocol'],
                'OPENVPN_USERNAME': config['username'],
                'OPENVPN_PASSWORD': config['password'],
                'OPENVPN_CA_CERT': config['caCert'],
                'OPENVPN_ADDITIONAL_CONFIG': config['additionalConfig']
            }
            self._update_env_file(updates)
            return {'success': True, 'message': 'Configuração OpenVPN salva com sucesso!'}
        except Exception as e:
            return {'success': False, 'message': f'Erro ao salvar configuração OpenVPN: {str(e)}'}