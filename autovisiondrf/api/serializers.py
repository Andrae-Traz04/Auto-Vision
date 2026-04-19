from rest_framework import serializers
from .models import Device, SystemUser, AuditLog

class DeviceSerializer(serializers.ModelSerializer):
    deviceId = serializers.CharField(source='device_id') 

    class Meta:
        model = Device
        fields = ['id', 'name', 'location', 'status', 'deviceId']


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
