from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional
from application.services.chart_service import ChartService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/bar")
async def get_bar_chart(
    user=Depends(get_current_user),
    category: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    chart_service = ChartService()
    filters = {}
    if category:
        filters["category"] = category
    if date_from:
        filters["date_from"] = date_from
    if date_to:
        filters["date_to"] = date_to
    
    data = await chart_service.get_bar_chart_data(filters)
    return {"chart_type": "bar", "data": data}

@router.get("/pie")
async def get_pie_chart(
    user=Depends(get_current_user),
    category: Optional[str] = Query(None)
):
    chart_service = ChartService()
    filters = {}
    if category:
        filters["category"] = category
    
    data = await chart_service.get_pie_chart_data(filters)
    return {"chart_type": "pie", "data": data}

@router.get("/{chart_type}")
async def get_chart_by_type(
    chart_type: str,
    user=Depends(get_current_user)
):
    chart_service = ChartService()
    data = await chart_service.get_chart_data_by_type(chart_type)
    return {"chart_type": chart_type, "data": data}