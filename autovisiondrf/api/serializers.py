from rest_framework import serializers
from .models import Device, DetectionLog, SystemUser, AuditLog

class DeviceSerializer(serializers.ModelSerializer):
    # Map Django's `device_id` snake_case to React's `deviceId` camelCase
    deviceId = serializers.CharField(source='device_id') 

    class Meta:
        model = Device
        fields = ['id', 'name', 'location', 'status', 'deviceId']

class DetectionLogSerializer(serializers.ModelSerializer):
    # Formatting these fields on the server so React doesn't have to
    confidence = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = DetectionLog
        fields = ['id', 'type', 'confidence', 'date', 'time']

    def get_confidence(self, obj):
        # Converts 0.92 to "92%"
        return f"{int(obj.confidence * 100)}%"

    def get_date(self, obj):
        return obj.timestamp.strftime('%b %d, %Y') # Returns "Feb 20, 2026"

    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %p') # Returns "6:15 PM"

class SystemUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUser
        fields = ['id', 'name', 'role']

class AuditLogSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'user', 'role', 'time']
        
    def get_time(self, obj):
        return obj.timestamp.strftime('%m/%d/%Y, %I:%M:%S %p')
