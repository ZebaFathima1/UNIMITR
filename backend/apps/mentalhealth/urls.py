from django.urls import path
from .views import CounsellorListView, CounsellorDetailView, AppointmentView, AppointmentDetailView

urlpatterns = [
    path('counsellors/', CounsellorListView.as_view(), name='counsellor-list'),
    path('counsellors/<int:pk>/', CounsellorDetailView.as_view(), name='counsellor-detail'),
    path('appointments/', AppointmentView.as_view(), name='appointment'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]
