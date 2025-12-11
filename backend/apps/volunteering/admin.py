from django.contrib import admin
from .models import VolunteeringOpportunity, VolunteeringApplication


@admin.register(VolunteeringOpportunity)
class VolunteeringOpportunityAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'date', 'status', 'created_at']
    list_filter = ['status', 'category', 'date']
    search_fields = ['title', 'organization', 'description']


@admin.register(VolunteeringApplication)
class VolunteeringApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'opportunity', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'email', 'student_id']