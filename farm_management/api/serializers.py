from rest_framework import serializers
from .models import (
    Admin, SysAdmin, VietGAPRegistration, Farmer, Farm, Stage, Lot, PlantingZone, Task, TaskCategory, TaskIcon,
    Material, FarmLog, IncidentReport
)


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = [
            'id',
            'phone',
            'name',
            'address',
            'representative',
            'registration_certificate',
            'google_id',
            'google_email',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = [
            'id',
            'phone',
            'pin',
            'password',
            'name',
            'address',
            'representative',
            'registration_certificate',
            'google_id',
            'google_email',
            'status',
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        admin = super().create(validated_data)
        if password:
            admin.set_password(password)
            admin.save(update_fields=['password'])
        return admin

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        admin = super().update(instance, validated_data)
        if password:
            admin.set_password(password)
            admin.save(update_fields=['password'])
        return admin


class SysAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = SysAdmin
        fields = ['id', 'email', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SysAdminCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SysAdmin
        fields = ['email', 'password', 'name']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        sysadmin = SysAdmin(**validated_data)
        sysadmin.set_password(password)
        sysadmin.save()
        return sysadmin

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class VietGAPRegistrationListSerializer(serializers.ModelSerializer):
    htx_name = serializers.CharField(source='admin.name', read_only=True)
    registration_type_label = serializers.CharField(
        source='get_registration_type_display', read_only=True,
    )
    status_label = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = VietGAPRegistration
        fields = [
            'id',
            'admin',
            'htx_name',
            'registration_type',
            'registration_type_label',
            'crop_type',
            'production_quantity',
            'planting_zone',
            'region_code',
            'status',
            'status_label',
            'document_files',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VietGAPRegistrationCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VietGAPRegistration
        fields = [
            'admin',
            'registration_type',
            'crop_type',
            'production_quantity',
            'planting_zone',
            'region_code',
            'status',
            'document_files',
            'notes',
        ]


class FarmerSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.name', read_only=True)

    class Meta:
        model = Farmer
        fields = ['id', 'admin', 'admin_name', 'phone', 'cccd', 'full_name', 'birth_year', 'managed_lot', 'google_id', 'google_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FarmerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ['admin', 'phone', 'pin', 'cccd', 'full_name', 'birth_year', 'managed_lot', 'google_id', 'google_email']
        extra_kwargs = {
            'admin': {'required': True},
        }

    def validate_phone(self, value):
        """Validate phone uniqueness - exclude current instance if updating"""
        if not value:
            return value
        
        queryset = Farmer.objects.filter(phone=value)
        
        # If updating, exclude the current instance being modified
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Số điện thoại này đã được đăng ký.")
        
        return value

    def validate_cccd(self, value):
        """Validate CCCD uniqueness - exclude current instance if updating"""
        if not value:
            return value
        
        queryset = Farmer.objects.filter(cccd=value)
        
        # If updating, exclude the current instance being modified
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Số CCCD này đã được đăng ký.")
        
        return value


class FarmSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.name', read_only=True)

    class Meta:
        model = Farm
        fields = ['id', 'admin', 'admin_name', 'cooperative_name', 'address', 'total_area', 'main_crop_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


class PlantingZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantingZone
        fields = ['id', 'crop_type', 'name', 'lots', 'certificate_files', 'admin', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskIconSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskIcon
        fields = ['id', 'name', 'icon_name', 'color_variants', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'icon', 'color', 'requires_materials', 'default_values', 'admin', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_admin(self, value):
        """Ensure admin is provided when creating task"""
        if value is None:
            raise serializers.ValidationError("Admin (HTX) assignment is required for tasks.")
        return value


class TaskCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = ['id', 'name', 'task_ids', 'created_at']
        read_only_fields = ['id', 'created_at']


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name', 'type', 'active_ingredient', 'is_vietgap', 'status', 'unit', 'quantity', 'min_stock', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FarmLogListSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    lot_name = serializers.CharField(source='lot.name', read_only=True)
    task_name = serializers.CharField(source='task.name', read_only=True)

    class Meta:
        model = FarmLog
        fields = ['id', 'farmer', 'farmer_name', 'stage', 'stage_name', 'lot', 'lot_name', 'datetime', 
                  'task', 'task_name', 'pest', 'method', 'fertilizer', 'active_ingredient', 'dosage', 
                  'quarantine_time', 'images', 'waste_type', 'material_name', 'material_quantity', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FarmLogCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmLog
        fields = ['farmer', 'stage', 'lot', 'datetime', 'task', 'pest', 'method', 'fertilizer',
                  'active_ingredient', 'dosage', 'quarantine_time', 'images', 'waste_type',
                  'material_name', 'material_quantity']


class IncidentReportListSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    lot_name = serializers.CharField(source='lot.name', read_only=True)

    class Meta:
        model = IncidentReport
        fields = ['id', 'farmer', 'farmer_name', 'lot', 'lot_name', 'datetime', 'report_type',
                  'description', 'images', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class IncidentReportCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentReport
        fields = ['farmer', 'lot', 'datetime', 'report_type', 'description', 'images']
