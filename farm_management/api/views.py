from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from .models import (
    Admin, SysAdmin, Farmer, Stage, Lot, PlantingZone, Task, TaskCategory,
    Material, FarmLog, IncidentReport
)
from .serializers import (
    AdminSerializer, AdminCreateSerializer, SysAdminSerializer, SysAdminCreateSerializer,
    FarmerSerializer, FarmerCreateSerializer, StageSerializer, LotSerializer,
    PlantingZoneSerializer, TaskSerializer, TaskCategorySerializer,
    MaterialSerializer, FarmLogListSerializer, FarmLogCreateUpdateSerializer,
    IncidentReportListSerializer, IncidentReportCreateUpdateSerializer
)


class AdminViewSet(viewsets.ModelViewSet):
    """ViewSet for Admin management"""
    queryset = Admin.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'phone', 'google_email']
    filterset_fields = ['phone', 'google_email']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdminCreateSerializer
        return AdminSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Admin login with phone/pin or google_id"""
        phone = request.data.get('phone')
        pin = request.data.get('pin')
        email = request.data.get('email')
        password = request.data.get('password')
        google_id = request.data.get('google_id')

        if phone and pin:
            admin = Admin.objects.filter(phone=phone, pin=pin).first()
            if not admin:
                admin = Admin.objects.filter(phone=phone).first()
                if admin and not admin.check_password(pin):
                    admin = None
        elif email and password:
            admin = Admin.objects.filter(Q(phone=email) | Q(google_email=email)).first()
            if admin:
                if not admin.check_password(password) and admin.pin != password:
                    admin = None
        elif google_id:
            admin = Admin.objects.filter(google_id=google_id).first()
        else:
            return Response({'error': 'Phone/PIN, Email/password or Google ID required'}, status=status.HTTP_400_BAD_REQUEST)

        if admin:
            serializer = AdminSerializer(admin)
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Admin registration"""
        serializer = AdminCreateSerializer(data=request.data)
        if serializer.is_valid():
            admin = serializer.save()
            response_serializer = AdminSerializer(admin)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SysAdminViewSet(viewsets.ModelViewSet):
    """ViewSet for system administrator login and registration"""
    queryset = SysAdmin.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['email', 'name']
    filterset_fields = ['email']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SysAdminCreateSerializer
        return SysAdminSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """SysAdmin login with email/password"""
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

        sysadmin = SysAdmin.objects.filter(email=email).first()
        if sysadmin and sysadmin.check_password(password):
            serializer = SysAdminSerializer(sysadmin)
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """SysAdmin registration"""
        serializer = SysAdminCreateSerializer(data=request.data)
        if serializer.is_valid():
            sysadmin = serializer.save()
            response_serializer = SysAdminSerializer(sysadmin)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FarmerViewSet(viewsets.ModelViewSet):
    """ViewSet for Farmer management"""
    queryset = Farmer.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['full_name', 'phone', 'google_email', 'managed_lot']
    filterset_fields = ['phone', 'google_email', 'managed_lot']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return FarmerCreateSerializer
        return FarmerSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Farmer login with phone/pin or google_id"""
        phone = request.data.get('phone')
        pin = request.data.get('pin')
        google_id = request.data.get('google_id')

        if phone and pin:
            farmer = Farmer.objects.filter(phone=phone, pin=pin).first()
        elif google_id:
            farmer = Farmer.objects.filter(google_id=google_id).first()
        else:
            return Response({'error': 'Phone/PIN or Google ID required'}, status=status.HTTP_400_BAD_REQUEST)

        if farmer:
            serializer = FarmerSerializer(farmer)
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Farmer registration"""
        serializer = FarmerCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StageViewSet(viewsets.ModelViewSet):
    """ViewSet for Stages"""
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class LotViewSet(viewsets.ModelViewSet):
    """ViewSet for Lots"""
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class PlantingZoneViewSet(viewsets.ModelViewSet):
    """ViewSet for Planting Zones"""
    queryset = PlantingZone.objects.all()
    serializer_class = PlantingZoneSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'crop_type']
    filterset_fields = ['crop_type']


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for Tasks"""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['requires_materials']


class TaskCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Task Categories"""
    queryset = TaskCategory.objects.all()
    serializer_class = TaskCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class MaterialViewSet(viewsets.ModelViewSet):
    """ViewSet for Materials"""
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'active_ingredient']
    filterset_fields = ['type', 'is_vietgap']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get materials with low stock"""
        materials = Material.objects.filter(quantity__lte=F('min_stock'))
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)


class FarmLogViewSet(viewsets.ModelViewSet):
    """ViewSet for Farm Logs"""
    queryset = FarmLog.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['farmer__full_name', 'task__name', 'stage__name', 'lot__name']
    filterset_fields = ['farmer', 'stage', 'lot', 'task']
    ordering_fields = ['datetime', 'created_at']
    ordering = ['-datetime']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return FarmLogListSerializer
        return FarmLogCreateUpdateSerializer

    @action(detail=False, methods=['get'])
    def by_farmer(self, request):
        """Get logs by farmer"""
        farmer_id = request.query_params.get('farmer_id')
        if not farmer_id:
            return Response({'error': 'farmer_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        logs = FarmLog.objects.filter(farmer_id=farmer_id)
        serializer = FarmLogListSerializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_lot(self, request):
        """Get logs by lot"""
        lot_id = request.query_params.get('lot_id')
        if not lot_id:
            return Response({'error': 'lot_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        logs = FarmLog.objects.filter(lot_id=lot_id)
        serializer = FarmLogListSerializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_stage(self, request):
        """Get logs by stage"""
        stage_id = request.query_params.get('stage_id')
        if not stage_id:
            return Response({'error': 'stage_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        logs = FarmLog.objects.filter(stage_id=stage_id)
        serializer = FarmLogListSerializer(logs, many=True)
        return Response(serializer.data)


class IncidentReportViewSet(viewsets.ModelViewSet):
    """ViewSet for Incident Reports"""
    queryset = IncidentReport.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['farmer__full_name', 'report_type', 'description']
    filterset_fields = ['farmer', 'lot', 'report_type']
    ordering_fields = ['datetime', 'created_at']
    ordering = ['-datetime']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return IncidentReportListSerializer
        return IncidentReportCreateUpdateSerializer

    @action(detail=False, methods=['get'])
    def by_farmer(self, request):
        """Get reports by farmer"""
        farmer_id = request.query_params.get('farmer_id')
        if not farmer_id:
            return Response({'error': 'farmer_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        reports = IncidentReport.objects.filter(farmer_id=farmer_id)
        serializer = IncidentReportListSerializer(reports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_lot(self, request):
        """Get reports by lot"""
        lot_id = request.query_params.get('lot_id')
        if not lot_id:
            return Response({'error': 'lot_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        reports = IncidentReport.objects.filter(lot_id=lot_id)
        serializer = IncidentReportListSerializer(reports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unresolved(self, request):
        """Get unresolved incidents (recent ones)"""
        reports = IncidentReport.objects.filter(
            Q(report_type__in=['Sâu bệnh', 'Sự cố kỹ thuật', 'Cảnh báo'])
        ).order_by('-datetime')[:20]
        serializer = IncidentReportListSerializer(reports, many=True)
        return Response(serializer.data)
