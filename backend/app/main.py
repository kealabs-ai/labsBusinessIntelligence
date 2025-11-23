from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from presentation.endpoints import auth, charts, agendamentos, contacts
from api import communication
from infrastructure.database.factory import DatabaseFactory
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LabsBusinessIntelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
DatabaseFactory.initialize()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(charts.router, prefix="/api/v1/chart", tags=["charts"])
app.include_router(agendamentos.router, prefix="/api/v1/agendamentos", tags=["agendamentos"])
app.include_router(contacts.router, prefix="/api/v1/contacts", tags=["contacts"])
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