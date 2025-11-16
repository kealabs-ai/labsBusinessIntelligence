from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from presentation.endpoints import auth, charts
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

@app.get("/")
async def root():
    return {"message": "LabsBusinessIntelligence API"}

if __name__ == "__main__":
    import uvicorn
    import logging
    
    # Configurar logging para suprimir warnings desnecessários
    logging.getLogger("uvicorn.error").setLevel(logging.ERROR)
    
    port = int(os.getenv("PORT", 6002))
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port, 
        log_level="error",
        access_log=False,
        server_header=False,
        date_header=False
    )