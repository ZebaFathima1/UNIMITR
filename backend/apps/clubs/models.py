from django.db import models
from django.contrib.auth.models import User

class Club(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='clubs_created')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ClubJoinRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='join_requests')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    student_id = models.CharField(max_length=100)
    phone = models.CharField(max_length=30, blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} -> {self.club.name} ({self.status})"
