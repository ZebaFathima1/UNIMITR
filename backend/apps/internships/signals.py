from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Internship

@receiver([post_save, post_delete], sender=Internship)
def invalidate_internships_cache(sender, **kwargs):
    """Invalidate internships cache when an internship is created, updated, or deleted."""
    cache.delete('internships_list')
