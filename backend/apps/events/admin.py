from django.contrib import admin
from .models import Event, EventRegistration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'date', 'time', 'location', 'category', 'created_by', 'created_at')
    list_filter = ('status', 'category', 'date')
    search_fields = ('title', 'description', 'location')

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'full_name', 'student_id', 'email', 'phone', 'created_at')
    search_fields = ('full_name', 'student_id', 'email')
