from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date, parse_time
from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow all operations for admin dashboard
        return True

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-updated_at')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Cache-Control'] = 'no-store, no-cache'
        return response

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        event = self.get_object()
        event.status = 'approved'
        event.save(update_fields=['status'])
        return Response(EventSerializer(event).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        event = self.get_object()
        event.status = 'rejected'
        event.save(update_fields=['status'])
        return Response(EventSerializer(event).data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def registrations(self, request, pk=None):
        event = self.get_object()
        regs = EventRegistration.objects.filter(event=event).order_by('-created_at')
        return Response(EventRegistrationSerializer(regs, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request, pk=None):
        event = self.get_object()
        serializer = EventRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(event=event)
        return Response({'registrationId': serializer.instance.id, 'registration': serializer.data}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='registrations/(?P<rid>[^/.]+)/approve', permission_classes=[permissions.IsAdminUser])
    def approve_registration(self, request, pk=None, rid=None):
        event = self.get_object()
        try:
            reg = EventRegistration.objects.get(pk=rid, event=event)
        except EventRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
        reg.status = 'approved'
        reg.save(update_fields=['status'])
        return Response(EventRegistrationSerializer(reg).data)

    @action(detail=True, methods=['post'], url_path='registrations/(?P<rid>[^/.]+)/reject', permission_classes=[permissions.IsAdminUser])
    def reject_registration(self, request, pk=None, rid=None):
        event = self.get_object()
        try:
            reg = EventRegistration.objects.get(pk=rid, event=event)
        except EventRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
        reg.status = 'rejected'
        reg.save(update_fields=['status'])
        return Response(EventRegistrationSerializer(reg).data)

    @action(detail=False, methods=['get'], url_path='my-registrations', permission_classes=[permissions.AllowAny])
    def my_registrations(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'detail': 'Email parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        regs = EventRegistration.objects.filter(email=email).order_by('-created_at')
        return Response(EventRegistrationSerializer(regs, many=True).data)
