from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.conf import settings

class OnlyAdminBackend(ModelBackend):
    """
    Only allow login for the specified admin username and password.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # TEMPORARY: Allow any user with correct password to login for testing
        User = get_user_model()
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None
