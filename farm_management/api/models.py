from django.contrib.auth.hashers import check_password, make_password
from django.db import models


class Admin(models.Model):
    """Model for admin/manager login"""
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    pin = models.CharField(max_length=10, null=True, blank=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, null=True, blank=True)
    representative = models.CharField(max_length=255, null=True, blank=True)
    registration_certificate = models.CharField(max_length=255, null=True, blank=True)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    google_email = models.EmailField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admins'
        ordering = ['-created_at']

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        if not self.password:
            return False
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} - {self.phone or self.google_email}"


class SysAdmin(models.Model):
    """System administrator login accounts"""
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=100, default="System Admin")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sysadmins'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} <{self.email}>"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class Farmer(models.Model):
    """Model for farmer/user login and management"""
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    pin = models.CharField(max_length=10, null=True, blank=True)
    cccd = models.CharField(max_length=20, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=100)
    birth_year = models.CharField(max_length=4, null=True, blank=True)
    managed_lot = models.CharField(max_length=100, null=True, blank=True)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    google_email = models.EmailField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'farmers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.phone or self.google_email}"


class Stage(models.Model):
    """Crop growing stages"""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stages'
        ordering = ['name']

    def __str__(self):
        return self.name


class Lot(models.Model):
    """Lot/field information"""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'lots'
        ordering = ['name']

    def __str__(self):
        return self.name


class PlantingZone(models.Model):
    """Planting zones for crop management"""
    crop_type = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    lots = models.JSONField(default=list, blank=True)  # Array of LandLot objects
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'planting_zones'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.crop_type}"


class Task(models.Model):
    """Farm tasks/activities"""
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)
    requires_materials = models.BooleanField(default=False)
    default_values = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['name']

    def __str__(self):
        return self.name


class TaskCategory(models.Model):
    """Task categories for grouping"""
    name = models.CharField(max_length=100, unique=True)
    task_ids = models.JSONField(default=list, blank=True)  # Array of task IDs
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'task_categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Material(models.Model):
    """Farm materials - fertilizers, pesticides, etc."""
    MATERIAL_TYPES = [
        ('Phân bón', 'Phân bón'),
        ('Thuốc BVTV', 'Thuốc BVTV'),
        ('Khác', 'Khác'),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=MATERIAL_TYPES)
    active_ingredient = models.CharField(max_length=100, null=True, blank=True)
    is_vietgap = models.BooleanField(default=False)
    unit = models.CharField(max_length=20)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    min_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'materials'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.type})"


class FarmLog(models.Model):
    """Farm activity logs"""
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='farm_logs')
    stage = models.ForeignKey(Stage, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    lot = models.ForeignKey(Lot, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    datetime = models.DateTimeField()
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    pest = models.CharField(max_length=100, null=True, blank=True)
    method = models.CharField(max_length=100, null=True, blank=True)
    fertilizer = models.CharField(max_length=100, null=True, blank=True)
    active_ingredient = models.CharField(max_length=100, null=True, blank=True)
    dosage = models.CharField(max_length=100, null=True, blank=True)
    quarantine_time = models.CharField(max_length=50, null=True, blank=True)
    images = models.JSONField(default=list, blank=True)  # Array of image URLs
    waste_type = models.CharField(max_length=100, null=True, blank=True)
    material_name = models.CharField(max_length=100, null=True, blank=True)
    material_quantity = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'farm_logs'
        ordering = ['-datetime']

    def __str__(self):
        return f"{self.farmer.full_name} - {self.task.name if self.task else 'No task'} ({self.datetime})"


class IncidentReport(models.Model):
    """Incident/issue reports from farmers"""
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='incident_reports')
    lot = models.ForeignKey(Lot, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')
    datetime = models.DateTimeField()
    report_type = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField()
    images = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'incident_reports'
        ordering = ['-datetime']

    def __str__(self):
        return f"{self.farmer.full_name} - {self.report_type} ({self.datetime})"
