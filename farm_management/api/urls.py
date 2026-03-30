from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminViewSet, SysAdminViewSet, FarmerViewSet, StageViewSet, LotViewSet,
    PlantingZoneViewSet, TaskViewSet, TaskCategoryViewSet,
    MaterialViewSet, FarmLogViewSet, IncidentReportViewSet
)

router = DefaultRouter()
router.register(r'admins', AdminViewSet, basename='admin')
router.register(r'sysadmins', SysAdminViewSet, basename='sysadmin')
router.register(r'farmers', FarmerViewSet, basename='farmer')
router.register(r'stages', StageViewSet, basename='stage')
router.register(r'lots', LotViewSet, basename='lot')
router.register(r'planting-zones', PlantingZoneViewSet, basename='planting-zone')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'task-categories', TaskCategoryViewSet, basename='task-category')
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'farm-logs', FarmLogViewSet, basename='farm-log')
router.register(r'incident-reports', IncidentReportViewSet, basename='incident-report')

urlpatterns = [
    path('', include(router.urls)),
]
