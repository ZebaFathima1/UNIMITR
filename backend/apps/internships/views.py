from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Internship, InternshipApplication
from .serializers import InternshipSerializer, InternshipApplicationSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


class InternshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all().order_by('-updated_at')
    serializer_class = InternshipSerializer
    permission_classes = [IsAdminOrReadOnly]

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
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        internship = self.get_object()
        internship.status = 'approved'
        internship.save(update_fields=['status'])
        return Response(InternshipSerializer(internship).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        internship = self.get_object()
        internship.status = 'rejected'
        internship.save(update_fields=['status'])
        return Response(InternshipSerializer(internship).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def close(self, request, pk=None):
        internship = self.get_object()
        internship.status = 'closed'
        internship.save(update_fields=['status'])
        return Response(InternshipSerializer(internship).data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def applications(self, request, pk=None):
        internship = self.get_object()
        apps = InternshipApplication.objects.filter(internship=internship).order_by('-created_at')
        return Response(InternshipApplicationSerializer(apps, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def apply(self, request, pk=None):
        internship = self.get_object()
        serializer = InternshipApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(internship=internship)
        return Response({
            'applicationId': serializer.instance.id, 
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='applications/(?P<aid>[^/.]+)/approve', permission_classes=[permissions.IsAdminUser])
    def approve_application(self, request, pk=None, aid=None):
        internship = self.get_object()
        try:
            app = InternshipApplication.objects.get(pk=aid, internship=internship)
        except InternshipApplication.DoesNotExist:
            return Response({'detail': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        app.status = 'approved'
        app.save(update_fields=['status'])
        return Response(InternshipApplicationSerializer(app).data)

    @action(detail=True, methods=['post'], url_path='applications/(?P<aid>[^/.]+)/reject', permission_classes=[permissions.IsAdminUser])
    def reject_application(self, request, pk=None, aid=None):
        internship = self.get_object()
        try:
            app = InternshipApplication.objects.get(pk=aid, internship=internship)
        except InternshipApplication.DoesNotExist:
            return Response({'detail': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        app.status = 'rejected'
        app.save(update_fields=['status'])
        return Response(InternshipApplicationSerializer(app).data)

    @action(detail=True, methods=['post'], url_path='applications/(?P<aid>[^/.]+)/shortlist', permission_classes=[permissions.IsAdminUser])
    def shortlist_application(self, request, pk=None, aid=None):
        internship = self.get_object()
        try:
            app = InternshipApplication.objects.get(pk=aid, internship=internship)
        except InternshipApplication.DoesNotExist:
            return Response({'detail': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        app.status = 'shortlisted'
        app.save(update_fields=['status'])
        return Response(InternshipApplicationSerializer(app).data)