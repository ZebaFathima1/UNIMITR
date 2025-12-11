from django.contrib import admin
from .models import Workshop, WorkshopRegistration


@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'date', 'mode', 'status', 'created_at']
    list_filter = ['status', 'mode', 'category', 'date']
    search_fields = ['title', 'instructor', 'description']


@admin.register(WorkshopRegistration)
class WorkshopRegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'workshop', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'email', 'student_id']