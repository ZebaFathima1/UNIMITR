from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Event

@receiver([post_save, post_delete], sender=Event)
def invalidate_events_cache(sender, **kwargs):
    """Invalidate events cache when an event is created, updated, or deleted."""
    cache.delete('events_list')
