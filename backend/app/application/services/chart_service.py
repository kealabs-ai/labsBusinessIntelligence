from typing import List, Dict, Any
from infrastructure.database.factory import DatabaseFactory

class ChartService:
    def __init__(self):
        self.chart_repository = DatabaseFactory.get_chart_repository()
    
    async def get_bar_chart_data(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_chart_data("bar", filters)
    
    async def get_pie_chart_data(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_chart_data("pie", filters)
    
    async def get_line_chart_data(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_chart_data("line", filters)
    
    async def get_area_chart_data(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_chart_data("area", filters)
    
    async def get_scatter_chart_data(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_chart_data("scatter", filters)
    
    async def get_kpi_data(self, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_kpi_data(filters)
    
    async def get_chart_data_by_type(self, chart_type: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if filters is None:
            filters = {}
        return await self.chart_repository.get_chart_data(chart_type, filters)