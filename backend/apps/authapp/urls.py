from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, SignupView, UsersListView, MeView, SimpleLoginView, UserActivityStatsView, UserProfileView, AllUsersView, LeaderboardView, LeaderboardDetailView

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('users/', UsersListView.as_view(), name='users'),
    path('me/', MeView.as_view(), name='me'),
    # Compatibility login for existing frontend payload { email, role, name?, studentId?, phone? }
    path('compat-login/', SimpleLoginView.as_view(), name='compat_login'),
    # User activity stats for Digital Twin
    path('user-stats/', UserActivityStatsView.as_view(), name='user_stats'),
    # User profile save/get
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    # All users for admin dashboard
    path('all-users/', AllUsersView.as_view(), name='all_users'),
    # Leaderboard entries
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('leaderboard/<int:pk>/', LeaderboardDetailView.as_view(), name='leaderboard_detail'),
]
