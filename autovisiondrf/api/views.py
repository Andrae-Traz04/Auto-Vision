from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Device, DetectionLog, SystemUser, AuditLog
from .serializers import DeviceSerializer, DetectionLogSerializer, SystemUserSerializer, AuditLogSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class DetectionLogViewSet(viewsets.ModelViewSet):
    queryset = DetectionLog.objects.all().order_by('-timestamp')
    serializer_class = DetectionLogSerializer

class SystemUserViewSet(viewsets.ModelViewSet):
    queryset = SystemUser.objects.all()
    serializer_class = SystemUserSerializer

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, email=username, password=password)
    return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({'message': 'Success', 'user': username}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

