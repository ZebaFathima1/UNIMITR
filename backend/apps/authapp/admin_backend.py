from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.conf import settings

class OnlyAdminBackend(ModelBackend):
    """
    Only allow login for the specified admin username and password.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        ADMIN_USERNAME = getattr(settings, 'ADMIN_USERNAME', 'admin')
        ADMIN_PASSWORD = getattr(settings, 'ADMIN_PASSWORD', None)
        User = get_user_model()
        if username == ADMIN_USERNAME and ADMIN_PASSWORD:
            try:
                user = User.objects.get(username=username)
                if user.check_password(password) and user.is_staff:
                    return user
            except User.DoesNotExist:
                return None
        return None
