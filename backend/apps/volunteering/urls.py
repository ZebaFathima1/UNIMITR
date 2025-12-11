from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteeringOpportunityViewSet

router = DefaultRouter()
router.register(r'volunteering', VolunteeringOpportunityViewSet, basename='volunteering')

urlpatterns = [
    path('', include(router.urls)),
]