from django.contrib import admin
from .models import Club, ClubJoinRequest

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_by', 'created_at')
    search_fields = ('name',)

@admin.register(ClubJoinRequest)
class ClubJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'club', 'full_name', 'email', 'student_id', 'status', 'created_at')
    list_filter = ('status', 'club')
    search_fields = ('full_name', 'email', 'student_id')
