from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import VolunteeringOpportunity

@receiver([post_save, post_delete], sender=VolunteeringOpportunity)
def invalidate_volunteering_cache(sender, **kwargs):
    """Invalidate volunteering cache when an opportunity is created, updated, or deleted."""
    cache.delete('volunteering_list')
