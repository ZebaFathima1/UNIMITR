from django.db import models
from django.contrib.auth.models import User


class Workshop(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    )
    
    MODE_CHOICES = (
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('hybrid', 'Hybrid'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    instructor = models.CharField(max_length=200)
    organization = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    time = models.TimeField()
    duration_hours = models.IntegerField(default=2)
    location = models.CharField(max_length=200)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='offline')
    max_participants = models.IntegerField(default=50)
    fee = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    banner_url = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='workshops')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class WorkshopRegistration(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('attended', 'Attended'),
    )
    
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, related_name='registrations')
    full_name = models.CharField(max_length=200)
    student_id = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    expectations = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} -> {self.workshop.title} ({self.status})"