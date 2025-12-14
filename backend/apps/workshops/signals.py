from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Workshop

@receiver([post_save, post_delete], sender=Workshop)
def invalidate_workshops_cache(sender, **kwargs):
    """Invalidate workshops cache when a workshop is created, updated, or deleted."""
    cache.delete('workshops_list')
