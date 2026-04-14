from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet, DetectionLogViewSet, SystemUserViewSet, AuditLogViewSet, register_user, login_user

router = DefaultRouter()
router.register(r'devices', DeviceViewSet)
router.register(r'logs', DetectionLogViewSet)
router.register(r'users', SystemUserViewSet)
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
]
