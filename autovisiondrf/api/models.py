from django.db import models

class Device(models.Model):
    STATUS_CHOICES = [('Online', 'Online'), ('Offline', 'Offline')]
    
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Online')
    device_id = models.CharField(max_length=255) # matches your camera's deviceId
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"

class DetectionLog(models.Model):
    type = models.CharField(max_length=50) # e.g., Car, Motorcycle, Truck
    # Storing confidence as a decimal allows for analytical querying later, 
    # we will convert it to the "95%" format in the serializer.
    confidence = models.DecimalField(max_digits=5, decimal_places=2) 
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.timestamp}"

class SystemUser(models.Model):
    ROLE_CHOICES = [('Admin', 'Admin'), ('Operator', 'Operator'), ('Viewer', 'Viewer')]
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Viewer')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class AuditLog(models.Model):
    action = models.CharField(max_length=100) # e.g., 'Add User', 'Remove User'
    user = models.CharField(max_length=100) # Capturing name at time of action
    role = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp'] # Important: ensures newest logs appear first (for your top-down audit log design)
