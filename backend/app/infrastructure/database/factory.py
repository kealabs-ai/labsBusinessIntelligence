import os
from infrastructure.repositories.mysql_repository import MySQLUserRepository, MySQLChartRepository
from infrastructure.repositories.interfaces import IUserRepository, IChartRepository

try:
    from infrastructure.repositories.sqlserver_repository import SQLServerUserRepository, SQLServerChartRepository
    SQLSERVER_AVAILABLE = True
except ImportError:
    SQLSERVER_AVAILABLE = False

class DatabaseFactory:
    _user_repository: IUserRepository = None
    _chart_repository: IChartRepository = None
    
    @classmethod
    def initialize(cls):
        db_engine = os.getenv('DB_ENGINE', 'mysql').lower()
        
        if db_engine == 'mysql':
            cls._user_repository = MySQLUserRepository()
            cls._chart_repository = MySQLChartRepository()
        elif db_engine == 'sqlserver':
            if not SQLSERVER_AVAILABLE:
                raise ValueError("SQL Server support not available. Install pyodbc and ODBC drivers.")
            cls._user_repository = SQLServerUserRepository()
            cls._chart_repository = SQLServerChartRepository()
        else:
            raise ValueError(f"Unsupported database engine: {db_engine}")
    
    @classmethod
    def get_user_repository(cls) -> IUserRepository:
        if cls._user_repository is None:
            cls.initialize()
        return cls._user_repository
    
    @classmethod
    def get_chart_repository(cls) -> IChartRepository:
        if cls._chart_repository is None:
            cls.initialize()
        return cls._chart_repository