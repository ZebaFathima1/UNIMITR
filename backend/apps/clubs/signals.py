from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Club

@receiver([post_save, post_delete], sender=Club)
def invalidate_clubs_cache(sender, **kwargs):
    """Invalidate clubs cache when a club is created, updated, or deleted."""
    cache.delete('clubs_list')
