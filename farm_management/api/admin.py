from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Admin, Farmer, Farm, Stage, Lot, PlantingZone, Task, TaskCategory,
    Material, FarmLog, IncidentReport, VietGAPRegistration
)


@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'phone',
        'google_email',
        'address',
        'representative',
        'created_at',
    ]
    search_fields = ['name', 'phone', 'google_email', 'address', 'representative']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'phone', 'pin', 'address', 'representative')
        }),
        ('Giấy tờ HTX', {
            'fields': ('registration_certificate',),
        }),
        ('Google OAuth', {
            'fields': ('google_id', 'google_email'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ['cooperative_name', 'admin_name', 'main_crop_type', 'total_area', 'created_at']
    search_fields = ['cooperative_name', 'admin__name', 'main_crop_type']
    list_filter = ['main_crop_type', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin HTX', {
            'fields': ('admin', 'cooperative_name', 'address')
        }),
        ('Thông tin trang trại', {
            'fields': ('total_area', 'main_crop_type')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def admin_name(self, obj):
        return obj.admin.name
    admin_name.short_description = 'Quản lý viên'


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'admin_name', 'phone', 'cccd', 'managed_lot', 'created_at']
    search_fields = ['full_name', 'phone', 'cccd', 'google_email', 'admin__name']
    list_filter = ['managed_lot', 'admin__name', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin HTX', {
            'fields': ('admin',)
        }),
        ('Thông tin cá nhân', {
            'fields': ('full_name', 'birth_year', 'cccd')
        }),
        ('Thông tin đăng nhập', {
            'fields': ('phone', 'pin')
        }),
        ('Quản lý', {
            'fields': ('managed_lot',)
        }),
        ('Google OAuth', {
            'fields': ('google_id', 'google_email'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def admin_name(self, obj):
        return obj.admin.name
    admin_name.short_description = 'HTX'


@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']


@admin.register(Lot)
class LotAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']


@admin.register(PlantingZone)
class PlantingZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'crop_type', 'lot_count', 'created_at']
    search_fields = ['name', 'crop_type']
    list_filter = ['crop_type', 'created_at']
    readonly_fields = ['created_at', 'updated_at']

    def lot_count(self, obj):
        return len(obj.lots) if obj.lots else 0
    lot_count.short_description = 'Số lô'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['name', 'requires_materials_badge', 'created_at']
    search_fields = ['name']
    list_filter = ['requires_materials', 'created_at']
    readonly_fields = ['created_at']
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'icon', 'color', 'requires_materials')
        }),
        ('Giá trị mặc định', {
            'fields': ('default_values',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def requires_materials_badge(self, obj):
        if obj.requires_materials:
            return format_html('<span style="color: green;">✓ Có</span>')
        return format_html('<span style="color: red;">✗ Không</span>')
    requires_materials_badge.short_description = 'Yêu cầu vật tư'


@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'task_count', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']

    def task_count(self, obj):
        return len(obj.task_ids) if obj.task_ids else 0
    task_count.short_description = 'Số task'


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'quantity', 'unit', 'status', 'vietgap_badge', 'stock_warning', 'created_at']
    search_fields = ['name', 'active_ingredient']
    list_filter = ['type', 'is_vietgap', 'status', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'type', 'active_ingredient', 'is_vietgap', 'status')
        }),
        ('Kho', {
            'fields': ('unit', 'quantity', 'min_stock')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def vietgap_badge(self, obj):
        if obj.is_vietgap:
            return format_html('<span style="color: green;">✓ VietGAP</span>')
        return format_html('<span style="color: gray;">Không</span>')
    vietgap_badge.short_description = 'VietGAP'

    def stock_warning(self, obj):
        if obj.quantity <= obj.min_stock:
            return format_html('<span style="color: red;">⚠ Cảnh báo tồn kho</span>')
        return format_html('<span style="color: green;">✓ OK</span>')
    stock_warning.short_description = 'Tồn kho'


@admin.register(FarmLog)
class FarmLogAdmin(admin.ModelAdmin):
    list_display = ['farmer_name', 'task_name', 'lot_name', 'datetime', 'created_at']
    search_fields = ['farmer__full_name', 'task__name', 'lot__name']
    list_filter = ['task', 'stage', 'lot', 'datetime', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin nông dân', {
            'fields': ('farmer',)
        }),
        ('Thông tin vùng trồng', {
            'fields': ('stage', 'lot')
        }),
        ('Thông tin hoạt động', {
            'fields': ('datetime', 'task', 'pest', 'method', 'fertilizer', 'active_ingredient', 'dosage', 'quarantine_time')
        }),
        ('Chất thải', {
            'fields': ('waste_type',),
            'classes': ('collapse',)
        }),
        ('Vật tư', {
            'fields': ('material_name', 'material_quantity'),
            'classes': ('collapse',)
        }),
        ('Hình ảnh', {
            'fields': ('images',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def farmer_name(self, obj):
        return obj.farmer.full_name
    farmer_name.short_description = 'Nông dân'

    def task_name(self, obj):
        return obj.task.name if obj.task else '-'
    task_name.short_description = 'Task'

    def lot_name(self, obj):
        return obj.lot.name if obj.lot else '-'
    lot_name.short_description = 'Lô'


@admin.register(IncidentReport)
class IncidentReportAdmin(admin.ModelAdmin):
    list_display = ['farmer_name', 'report_type', 'lot_name', 'datetime', 'created_at']
    search_fields = ['farmer__full_name', 'report_type', 'description']
    list_filter = ['report_type', 'lot', 'datetime', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin báo cáo', {
            'fields': ('farmer', 'lot', 'datetime', 'report_type')
        }),
        ('Chi tiết', {
            'fields': ('description',)
        }),
        ('Hình ảnh', {
            'fields': ('images',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def farmer_name(self, obj):
        return obj.farmer.full_name
    farmer_name.short_description = 'Nông dân'

    def lot_name(self, obj):
        return obj.lot.name if obj.lot else '-'
    lot_name.short_description = 'Lô'


@admin.register(VietGAPRegistration)
class VietGAPRegistrationAdmin(admin.ModelAdmin):
    list_display = ['admin_name', 'registration_type', 'region_code', 'status', 'created_at']
    search_fields = ['admin__name', 'registration_type', 'region_code', 'notes']
    list_filter = ['registration_type', 'status', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Thông tin HTX', {
            'fields': ('admin', 'registration_type', 'region_code', 'status')
        }),
        ('Tài liệu & ghi chú', {
            'fields': ('document_files', 'notes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def admin_name(self, obj):
        return obj.admin.name
    admin_name.short_description = 'HTX'
