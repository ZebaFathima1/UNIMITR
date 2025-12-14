from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, LeaderboardEntry

admin.site.unregister(User)
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'last_login', 'date_joined')
    list_filter = ('is_staff',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'college_name', 'branch', 'roll_number', 'semester')
    search_fields = ('user__username', 'user__email', 'college_name', 'branch')
    list_filter = ('college_name', 'branch')


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'points', 'university', 'avatar', 'emoji', 'is_university_entry')
    list_filter = ('category', 'is_university_entry')
    search_fields = ('name', 'university')
    ordering = ('-points',)
    list_editable = ('points', 'emoji')
