from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.core.files.storage import default_storage
import json
from uuid import uuid4
from .models import (
    Admin, SysAdmin, VietGAPRegistration, Farmer, Farm, Stage, Lot, PlantingZone, Task, TaskCategory, TaskIcon,
    Material, FarmLog, IncidentReport
)
from .serializers import (
    AdminSerializer, AdminCreateSerializer, SysAdminSerializer, SysAdminCreateSerializer,
    FarmerSerializer, FarmerCreateSerializer, FarmSerializer, StageSerializer, LotSerializer,
    PlantingZoneSerializer, TaskSerializer, TaskCategorySerializer, TaskIconSerializer,
    MaterialSerializer, FarmLogListSerializer, FarmLogCreateUpdateSerializer,
    IncidentReportListSerializer, IncidentReportCreateUpdateSerializer,
    VietGAPRegistrationListSerializer, VietGAPRegistrationCreateUpdateSerializer,
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
    search_fields = ['full_name', 'phone', 'google_email', 'managed_lot', 'admin__name']
    filterset_fields = ['phone', 'google_email', 'managed_lot', 'admin']

    def get_queryset(self):
        """Filter farmers by admin if admin_id is provided in query params"""
        queryset = Farmer.objects.all()
        admin_id = self.request.query_params.get('admin_id')
        if admin_id:
            queryset = queryset.filter(admin_id=admin_id)
        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return FarmerCreateSerializer
        return FarmerSerializer

    def create(self, request, *args, **kwargs):
        """Create a new farmer with logging"""
        print(f"🆕 [FARMER CREATE] Request data: {request.data}")
        print(f"📋 [FARMER CREATE] Request method: {request.method}")
        print(f"📍 [FARMER CREATE] Content-Type: {request.content_type}")
        
        try:
            response = super().create(request, *args, **kwargs)
            print(f"✅ [FARMER CREATE] Success - created farmer ID: {response.data.get('id')}")
            return response
        except Exception as e:
            print(f"❌ [FARMER CREATE] Error: {e}")
            print(f"❌ [FARMER CREATE] Error type: {type(e)}")
            raise

    def update(self, request, *args, **kwargs):
        """Update farmer with logging"""
        print(f"📝 [FARMER UPDATE] Request data: {request.data}")
        print(f"📍 [FARMER UPDATE] Farmer ID: {kwargs.get('pk')}")
        print(f"📍 [FARMER UPDATE] Full kwargs: {kwargs}")
        print(f"📍 [FARMER UPDATE] Request path: {request.path}")
        
        try:
            response = super().update(request, *args, **kwargs)
            print(f"✅ [FARMER UPDATE] Success")
            return response
        except Exception as e:
            print(f"❌ [FARMER UPDATE] Error: {e}")
            raise

    def partial_update(self, request, *args, **kwargs):
        """Partial update (PATCH) farmer with logging"""
        print(f"📝 [FARMER PARTIAL UPDATE] Request data: {request.data}")
        print(f"📍 [FARMER PARTIAL UPDATE] Farmer ID from kwargs: {kwargs.get('pk')}")
        print(f"📍 [FARMER PARTIAL UPDATE] Full kwargs: {kwargs}")
        print(f"📍 [FARMER PARTIAL UPDATE] Request path: {request.path}")
        
        try:
            response = super().partial_update(request, *args, **kwargs)
            print(f"✅ [FARMER PARTIAL UPDATE] Success")
            return response
        except Exception as e:
            print(f"❌ [FARMER PARTIAL UPDATE] Error: {e}")
            print(f"❌ [FARMER PARTIAL UPDATE] Error type: {type(e).__name__}")
            raise

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


class FarmViewSet(viewsets.ModelViewSet):
    """ViewSet for Farm information"""
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['cooperative_name', 'main_crop_type', 'admin__name']
    filterset_fields = ['admin']

    @action(detail=False, methods=['get'])
    def by_admin(self, request):
        """Get farm info by admin"""
        admin_id = request.query_params.get('admin_id')
        if not admin_id:
            return Response({'error': 'admin_id required'}, status=status.HTTP_400_BAD_REQUEST)

        farm = Farm.objects.filter(admin_id=admin_id).first()
        if farm:
            serializer = FarmSerializer(farm)
            return Response(serializer.data)
        return Response({'error': 'Farm not found'}, status=status.HTTP_404_NOT_FOUND)


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
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'crop_type']
    filterset_fields = ['admin', 'crop_type']

    def _save_uploaded_files(self, uploaded_files):
        saved_urls = []
        for uploaded_file in uploaded_files:
            filename = f"planting_zone_certificates/{uuid4().hex}_{uploaded_file.name}"
            saved_path = default_storage.save(filename, uploaded_file)
            saved_urls.append(default_storage.url(saved_path))
        return saved_urls

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        uploaded_files = request.FILES.getlist('certificate_files')
        if uploaded_files:
            saved_urls = self._save_uploaded_files(uploaded_files)
            data['certificate_files'] = json.dumps(saved_urls)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        uploaded_files = request.FILES.getlist('certificate_files')
        if uploaded_files:
            existing_files = instance.certificate_files or []
            new_files = self._save_uploaded_files(uploaded_files)
            data['certificate_files'] = json.dumps(existing_files + new_files)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class TaskIconViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Task Icons - read-only list of available icons"""
    queryset = TaskIcon.objects.all()
    serializer_class = TaskIconSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'icon_name']


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for Tasks"""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['requires_materials', 'admin']

    def get_queryset(self):
        queryset = Task.objects.all()
        admin_id = self.request.query_params.get('admin_id')
        if admin_id:
            queryset = queryset.filter(admin_id=admin_id)
        return queryset


class TaskCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Task Categories - visible only to farmers assigned to an HTX"""
    queryset = TaskCategory.objects.all()
    serializer_class = TaskCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = []

    def get_queryset(self):
        """
        Task categories are only visible to farmers that are assigned to an HTX.
        Query params: 
        - farmer_id: the farmer requesting the categories
        - admin_id: the admin/HTX requesting the categories
        If no farmer_id/admin_id provided, assume admin access and return all categories.
        """
        farmer_id = self.request.query_params.get('farmer_id')
        admin_id = self.request.query_params.get('admin_id')
        
        if farmer_id:
            # Farmer is requesting - check if farmer exists and has an admin (HTX) assigned
            farmer = Farmer.objects.filter(id=farmer_id, admin__isnull=False).first()
            if farmer:
                # Farmer is assigned to HTX, show all categories
                return TaskCategory.objects.all()
            else:
                # Farmer either doesn't exist or has no HTX assigned - deny access
                return TaskCategory.objects.none()
        else:
            # No farmer_id provided - assume admin/system access, return all categories
            return TaskCategory.objects.all()
    
    def list(self, request, *args, **kwargs):
        """Override list to filter task_ids by admin_id"""
        response = super().list(request, *args, **kwargs)
        
        # Get admin_id from query params to filter task_ids
        admin_id = request.query_params.get('admin_id')
        farmer_id = request.query_params.get('farmer_id')
        
        # Determine which admin_id to use for filtering task_ids
        filter_admin_id = None
        if admin_id:
            filter_admin_id = admin_id
        elif farmer_id:
            # If farmer_id provided, get the farmer's admin_id (HTX)
            farmer = Farmer.objects.filter(id=farmer_id).first()
            if farmer and farmer.admin_id:
                filter_admin_id = farmer.admin_id
        
        # Filter task_ids to only include tasks for this admin
        if filter_admin_id:
            for category in response.data.get('results', []):
                if 'task_ids' in category:
                    # Filter task_ids to only include tasks belonging to the admin
                    original_task_ids = category['task_ids']
                    filtered_task_ids = []
                    for task_id in original_task_ids:
                        if Task.objects.filter(id=task_id, admin_id=filter_admin_id).exists():
                            filtered_task_ids.append(task_id)
                    category['task_ids'] = filtered_task_ids
        
        return response
        return TaskCategory.objects.none()


class MaterialViewSet(viewsets.ModelViewSet):
    """ViewSet for Materials"""
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'active_ingredient']
    filterset_fields = ['type', 'is_vietgap', 'status']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get materials with low stock"""
        materials = Material.objects.filter(quantity__lte=F('min_stock'))
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)


class VietGAPRegistrationViewSet(viewsets.ModelViewSet):
    """ViewSet for VietGAP / GACC registration requests"""
    queryset = VietGAPRegistration.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['admin__name', 'registration_type', 'region_code', 'status', 'notes']
    filterset_fields = ['admin', 'registration_type', 'status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return VietGAPRegistrationListSerializer
        return VietGAPRegistrationCreateUpdateSerializer

    @action(detail=False, methods=['get'])
    def by_admin(self, request):
        admin_id = request.query_params.get('admin_id')
        if not admin_id:
            return Response({'error': 'admin_id required'}, status=status.HTTP_400_BAD_REQUEST)

        requests = VietGAPRegistration.objects.filter(admin_id=admin_id)
        serializer = VietGAPRegistrationListSerializer(requests, many=True)
        return Response(serializer.data)


class FarmLogViewSet(viewsets.ModelViewSet):
    """ViewSet for Farm Logs"""
    queryset = FarmLog.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['farmer__full_name', 'task__name', 'stage__name', 'lot__name']
    filterset_fields = ['farmer', 'stage', 'lot', 'task', 'farmer__admin']
    ordering_fields = ['datetime', 'created_at']
    ordering = ['-datetime']

    def get_queryset(self):
        """Filter logs by admin_id (for admins) or farmer_id (for farmers)"""
        queryset = FarmLog.objects.all()
        admin_id = self.request.query_params.get('admin_id')
        farmer_id = self.request.query_params.get('farmer_id')
        
        if admin_id:
            # Admin filtering: show logs of farmers under this admin
            queryset = queryset.filter(farmer__admin_id=admin_id)
        elif farmer_id:
            # Farmer filtering: show only this farmer's logs
            queryset = queryset.filter(farmer_id=farmer_id)
        
        return queryset

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
    filterset_fields = ['farmer', 'lot', 'report_type', 'farmer__admin']
    ordering_fields = ['datetime', 'created_at']
    ordering = ['-datetime']

    def get_queryset(self):
        """Filter reports by admin_id if provided"""
        queryset = IncidentReport.objects.all()
        admin_id = self.request.query_params.get('admin_id')
        if admin_id:
            queryset = queryset.filter(farmer__admin_id=admin_id)
        return queryset

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
