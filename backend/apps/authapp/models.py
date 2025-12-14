from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile with additional details"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    college_name = models.CharField(max_length=200, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    roll_number = models.CharField(max_length=50, blank=True)
    semester = models.CharField(max_length=10, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    profile_image = models.TextField(blank=True)  # Base64 encoded image
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.username}"


class LeaderboardEntry(models.Model):
    """Leaderboard entries for gamification"""
    CATEGORY_CHOICES = [
        ('global', 'Global'),
        ('university', 'University'),
        ('friends', 'Friends'),
    ]
    
    name = models.CharField(max_length=200)
    university = models.CharField(max_length=200, blank=True)
    points = models.IntegerField(default=0)
    avatar = models.CharField(max_length=10, blank=True)  # Initials like "PS", "AM"
    emoji = models.CharField(max_length=10, blank=True, default='⭐')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='global')
    is_university_entry = models.BooleanField(default=False)  # True if this is a university ranking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-points']
        verbose_name_plural = 'Leaderboard Entries'

    def __str__(self):
        return f"{self.name} - {self.points} pts ({self.category})"

