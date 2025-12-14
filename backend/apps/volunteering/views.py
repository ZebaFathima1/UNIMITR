from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import VolunteeringOpportunity, VolunteeringApplication
from .serializers import VolunteeringOpportunitySerializer, VolunteeringApplicationSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow all operations for admin dashboard
        return True


class VolunteeringOpportunityViewSet(viewsets.ModelViewSet):
    queryset = VolunteeringOpportunity.objects.all().order_by('-created_at')
    serializer_class = VolunteeringOpportunitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def perform_create(self, serializer):
        # Don't require user for admin dashboard
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        opportunity = self.get_object()
        opportunity.status = 'approved'
        opportunity.save(update_fields=['status'])
        return Response(VolunteeringOpportunitySerializer(opportunity).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        opportunity = self.get_object()
        opportunity.status = 'rejected'
        opportunity.save(update_fields=['status'])
        return Response(VolunteeringOpportunitySerializer(opportunity).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def close(self, request, pk=None):
        opportunity = self.get_object()
        opportunity.status = 'closed'
        opportunity.save(update_fields=['status'])
        return Response(VolunteeringOpportunitySerializer(opportunity).data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def applications(self, request, pk=None):
        opportunity = self.get_object()
        apps = VolunteeringApplication.objects.filter(opportunity=opportunity).order_by('-created_at')
        return Response(VolunteeringApplicationSerializer(apps, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def apply(self, request, pk=None):
        opportunity = self.get_object()
        serializer = VolunteeringApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(opportunity=opportunity)
        return Response({
            'applicationId': serializer.instance.id, 
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='applications/(?P<aid>[^/.]+)/approve', permission_classes=[permissions.IsAdminUser])
    def approve_application(self, request, pk=None, aid=None):
        opportunity = self.get_object()
        try:
            app = VolunteeringApplication.objects.get(pk=aid, opportunity=opportunity)
        except VolunteeringApplication.DoesNotExist:
            return Response({'detail': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        app.status = 'approved'
        app.save(update_fields=['status'])
        return Response(VolunteeringApplicationSerializer(app).data)

    @action(detail=True, methods=['post'], url_path='applications/(?P<aid>[^/.]+)/reject', permission_classes=[permissions.IsAdminUser])
    def reject_application(self, request, pk=None, aid=None):
        opportunity = self.get_object()
        try:
            app = VolunteeringApplication.objects.get(pk=aid, opportunity=opportunity)
        except VolunteeringApplication.DoesNotExist:
            return Response({'detail': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        app.status = 'rejected'
        app.save(update_fields=['status'])
        return Response(VolunteeringApplicationSerializer(app).data)

    @action(detail=False, methods=['get'], url_path='my-applications', permission_classes=[permissions.AllowAny])
    def my_applications(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'detail': 'Email parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        apps = VolunteeringApplication.objects.filter(email=email).order_by('-created_at')
        return Response(VolunteeringApplicationSerializer(apps, many=True).data)