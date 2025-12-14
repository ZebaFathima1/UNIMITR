from django.apps import AppConfig


class VolunteeringConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.volunteering'

    def ready(self):
        import apps.volunteering.signals
