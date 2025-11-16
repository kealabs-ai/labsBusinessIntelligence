# LabsBusinessIntelligence

Sistema de Business Intelligence desenvolvido com arquitetura Clean Code e padrão Container/Presentational.

## Arquitetura

### Backend (Python/FastAPI)
- **Camada de Domínio**: Entidades de negócio (User, Token)
- **Camada de Aplicação**: Serviços e lógica de negócio
- **Camada de Infraestrutura**: Repositórios e acesso a dados
- **Camada de Apresentação**: Endpoints da API

### Frontend (React/MUI)
- **Containers**: Lógica de estado e negócio
- **Presentational**: Componentes de UI pura
- **Services**: Comunicação com API

## Ambientes

| Ambiente | Backend | Frontend | Descrição |
|----------|---------|----------|-----------|
| DEV      | 6002    | 3002     | Desenvolvimento local |
| HML      | 6001    | 3001     | Homologação |
| PROD     | 6000    | 3000     | Produção |

## Execução Local

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento frontend)
- Python 3.11+ (para desenvolvimento backend)

### Executar com Docker
```bash
# Clonar o repositório
git clone https://github.com/kealabs-ai/labsBusinessIntelligence.git
cd LabsBusinessIntelligence

# Copiar arquivos de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Executar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### Executar para Desenvolvimento

#### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python app/main.py
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Alternância de Banco de Dados

O sistema suporta MySQL e SQL Server através da variável de ambiente `DB_ENGINE`:

```bash
# Para MySQL
DB_ENGINE=mysql

# Para SQL Server
DB_ENGINE=sqlserver
```

## Endpoints da API

### Autenticação
- `POST /api/v1/auth/login` - Login do usuário
- `GET /api/v1/auth/me` - Dados do usuário atual

### Gráficos
- `GET /api/v1/chart/bar` - Dados para gráfico de barras
- `GET /api/v1/chart/pie` - Dados para gráfico de pizza
- `GET /api/v1/chart/{type}` - Dados por tipo de gráfico

## Credenciais Padrão
- **Usuário**: admin
- **Senha**: admin123

## DevOps

### Pipeline Jenkins
O projeto inclui um Jenkinsfile com pipeline completo:
1. Build das imagens Docker
2. Execução de testes
3. Deploy automático por ambiente

### Estrutura de Deploy
- **DEV**: Deploy automático em qualquer branch
- **HML**: Deploy automático na branch `develop`
- **PROD**: Deploy manual na branch `main`

## Tecnologias

### Backend
- FastAPI
- SQLAlchemy
- JWT Authentication
- MySQL/SQL Server

### Frontend
- React 18
- Material-UI (MUI)
- Recharts
- Axios

### DevOps
- Docker
- Jenkins
- Docker Compose
