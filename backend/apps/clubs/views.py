from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Club, ClubJoinRequest
from .serializers import ClubSerializer, ClubJoinRequestSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all().order_by('name')
    serializer_class = ClubSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

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
