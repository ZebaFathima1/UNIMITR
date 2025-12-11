from django.db import models
from django.contrib.auth.models import User


class VolunteeringOpportunity(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('closed', 'Closed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    organization = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    date = models.DateField()
    time = models.TimeField()
    duration_hours = models.IntegerField(default=1)
    required_volunteers = models.IntegerField(default=1)
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    banner_url = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='volunteering_opportunities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class VolunteeringApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    opportunity = models.ForeignKey(VolunteeringOpportunity, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=200)
    student_id = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    motivation = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} -> {self.opportunity.title} ({self.status})"