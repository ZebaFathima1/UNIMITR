from django.contrib import admin
from .models import Internship, InternshipApplication


@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'location', 'internship_type', 'status', 'application_deadline', 'created_at']
    list_filter = ['status', 'internship_type', 'category', 'application_deadline']
    search_fields = ['title', 'company', 'description']


@admin.register(InternshipApplication)
class InternshipApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'internship', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'email', 'student_id']