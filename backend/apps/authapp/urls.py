from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, SignupView, UsersListView, MeView, SimpleLoginView

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('users/', UsersListView.as_view(), name='users'),
    path('me/', MeView.as_view(), name='me'),
    # Compatibility login for existing frontend payload { email, role, name?, studentId?, phone? }
    path('compat-login/', SimpleLoginView.as_view(), name='compat_login'),
]
