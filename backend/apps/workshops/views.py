from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Workshop, WorkshopRegistration
from .serializers import WorkshopSerializer, WorkshopRegistrationSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


class WorkshopViewSet(viewsets.ModelViewSet):
    queryset = Workshop.objects.all().order_by('-created_at')
    serializer_class = WorkshopSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        workshop = self.get_object()
        workshop.status = 'approved'
        workshop.save(update_fields=['status'])
        return Response(WorkshopSerializer(workshop).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        workshop = self.get_object()
        workshop.status = 'rejected'
        workshop.save(update_fields=['status'])
        return Response(WorkshopSerializer(workshop).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def complete(self, request, pk=None):
        workshop = self.get_object()
        workshop.status = 'completed'
        workshop.save(update_fields=['status'])
        return Response(WorkshopSerializer(workshop).data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def registrations(self, request, pk=None):
        workshop = self.get_object()
        regs = WorkshopRegistration.objects.filter(workshop=workshop).order_by('-created_at')
        return Response(WorkshopRegistrationSerializer(regs, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request, pk=None):
        workshop = self.get_object()
        serializer = WorkshopRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(workshop=workshop)
        return Response({
            'registrationId': serializer.instance.id, 
            'registration': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='registrations/(?P<rid>[^/.]+)/approve', permission_classes=[permissions.IsAdminUser])
    def approve_registration(self, request, pk=None, rid=None):
        workshop = self.get_object()
        try:
            reg = WorkshopRegistration.objects.get(pk=rid, workshop=workshop)
        except WorkshopRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
        reg.status = 'approved'
        reg.save(update_fields=['status'])
        return Response(WorkshopRegistrationSerializer(reg).data)

    @action(detail=True, methods=['post'], url_path='registrations/(?P<rid>[^/.]+)/reject', permission_classes=[permissions.IsAdminUser])
    def reject_registration(self, request, pk=None, rid=None):
        workshop = self.get_object()
        try:
            reg = WorkshopRegistration.objects.get(pk=rid, workshop=workshop)
        except WorkshopRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
        reg.status = 'rejected'
        reg.save(update_fields=['status'])
        return Response(WorkshopRegistrationSerializer(reg).data)

    @action(detail=True, methods=['post'], url_path='registrations/(?P<rid>[^/.]+)/mark-attended', permission_classes=[permissions.IsAdminUser])
    def mark_attended(self, request, pk=None, rid=None):
        workshop = self.get_object()
        try:
            reg = WorkshopRegistration.objects.get(pk=rid, workshop=workshop)
        except WorkshopRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
        reg.status = 'attended'
        reg.save(update_fields=['status'])
        return Response(WorkshopRegistrationSerializer(reg).data)