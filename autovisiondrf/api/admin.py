from django.contrib import admin

from django.contrib import admin
from .models import Device, DetectionLog, SystemUser, AuditLog


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'device_id', 'created_at']
    list_filter = ['status', 'location']
    search_fields = ['name', 'device_id']


@admin.register(DetectionLog)
class DetectionLogAdmin(admin.ModelAdmin):
    list_display = ['type', 'confidence', 'timestamp']
    list_filter = ['type']
    search_fields = ['type']


@admin.register(SystemUser)
class SystemUserAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'created_at']
    list_filter = ['role']
    search_fields = ['name']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'role', 'timestamp']
    list_filter = ['role', 'action']
    search_fields = ['user', 'action']
    readonly_fields = ['action', 'user', 'role', 'timestamp']