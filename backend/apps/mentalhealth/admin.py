from django.contrib import admin
from .models import Counsellor, CounsellorSlot, CounsellingAppointment, AnonymousChatSession


@admin.register(Counsellor)
class CounsellorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'rating', 'is_available')
    list_filter = ('is_available', 'specialization')
    search_fields = ('name', 'specialization')


@admin.register(CounsellorSlot)
class CounsellorSlotAdmin(admin.ModelAdmin):
    list_display = ('counsellor', 'time_slot', 'day', 'is_available')
    list_filter = ('is_available', 'counsellor')


@admin.register(CounsellingAppointment)
class CounsellingAppointmentAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'counsellor', 'slot', 'date', 'status')
    list_filter = ('status', 'counsellor')
    search_fields = ('user_email',)
    date_hierarchy = 'created_at'


@admin.register(AnonymousChatSession)
class AnonymousChatSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'started_at', 'ended_at', 'duration_minutes')
    date_hierarchy = 'started_at'
