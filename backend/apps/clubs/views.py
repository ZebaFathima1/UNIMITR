from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Club, ClubJoinRequest
from .serializers import ClubSerializer, ClubJoinRequestSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow all operations for admin dashboard
        return True

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all().order_by('-updated_at')
    serializer_class = ClubSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Cache-Control'] = 'no-store, no-cache'
        return response

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def join(self, request, pk=None):
        club = self.get_object()
        serializer = ClubJoinRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(club=club)
        return Response({'requestId': serializer.instance.id, 'request': serializer.data}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def requests(self, request, pk=None):
        club = self.get_object()
        reqs = ClubJoinRequest.objects.filter(club=club).order_by('-created_at')
        return Response(ClubJoinRequestSerializer(reqs, many=True).data)

    @action(detail=True, methods=['post'], url_path='requests/(?P<rid>[^/.]+)/approve', permission_classes=[permissions.IsAdminUser])
    def approve_request(self, request, pk=None, rid=None):
        club = self.get_object()
        try:
            req = ClubJoinRequest.objects.get(pk=rid, club=club)
        except ClubJoinRequest.DoesNotExist:
            return Response({'detail': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
        req.status = 'approved'
        req.save(update_fields=['status'])
        return Response(ClubJoinRequestSerializer(req).data)

    @action(detail=True, methods=['post'], url_path='requests/(?P<rid>[^/.]+)/reject', permission_classes=[permissions.IsAdminUser])
    def reject_request(self, request, pk=None, rid=None):
        club = self.get_object()
        try:
            req = ClubJoinRequest.objects.get(pk=rid, club=club)
        except ClubJoinRequest.DoesNotExist:
            return Response({'detail': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
        req.status = 'rejected'
        req.save(update_fields=['status'])
        return Response(ClubJoinRequestSerializer(req).data)

    @action(detail=False, methods=['get'], url_path='my-requests', permission_classes=[permissions.AllowAny])
    def my_requests(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'detail': 'Email parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        reqs = ClubJoinRequest.objects.filter(email=email).order_by('-created_at')
        return Response(ClubJoinRequestSerializer(reqs, many=True).data)
