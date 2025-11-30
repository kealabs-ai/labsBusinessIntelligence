from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from presentation.endpoints import auth, charts, agendamentos, contacts, admin, database_config, config
try:
    from presentation.endpoints import clients
    print("✓ Clients module imported successfully")
except Exception as e:
    print(f"✗ Error importing clients module: {e}")
    clients = None
from api import communication
from infrastructure.database.factory import DatabaseFactory
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LabsBusinessIntelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add OPTIONS handler for preflight requests
@app.options("/{path:path}")
async def options_handler(path: str):
    return {"message": "OK"}

# Initialize database
DatabaseFactory.initialize()

# Add startup event to log registered routes
@app.on_event("startup")
async def startup_event():
    print("=== API Routes ===")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"{route.methods} {route.path}")
    print("=================")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(charts.router, prefix="/api/v1/chart", tags=["charts"])
app.include_router(agendamentos.router, prefix="/api/v1/agendamentos", tags=["agendamentos"])
app.include_router(contacts.router, prefix="/api/v1/contacts", tags=["contacts"])
if clients:
    app.include_router(clients.router, prefix="/api/v1/clients", tags=["clients"])
    print("✓ Clients router registered successfully")
else:
    print("✗ Clients router not registered - module failed to import")
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(database_config.router, prefix="/api", tags=["database-config"])
app.include_router(config.router, prefix="/api", tags=["config"])
app.include_router(communication.router, prefix="/api/v1/communication", tags=["communication"])

@app.get("/")
async def root():
    return {"message": "LabsBusinessIntelligence API"}

if __name__ == "__main__":
    import uvicorn
    import logging
    
    # Configurar logging
    logging.basicConfig(level=logging.INFO)
    logging.getLogger("uvicorn.error").setLevel(logging.ERROR)
    
    port = int(os.getenv("PORT", 6002))
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port, 
        log_level="info",
        access_log=False,
        server_header=False,
        date_header=False
    )