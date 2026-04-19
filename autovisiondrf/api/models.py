from django.db import models

class Device(models.Model):
    STATUS_CHOICES = [('Online', 'Online'), ('Offline', 'Offline')]
    
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Online')
    device_id = models.CharField(max_length=255) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"


class SystemUser(models.Model):
    ROLE_CHOICES = [('Admin', 'Admin'), ('Operator', 'Operator'), ('Viewer', 'Viewer')]
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Viewer')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class AuditLog(models.Model):
    action = models.CharField(max_length=100) 
    user = models.CharField(max_length=100) 
    role = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']