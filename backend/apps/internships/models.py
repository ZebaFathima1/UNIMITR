from django.db import models
from django.contrib.auth.models import User


class Internship(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('closed', 'Closed'),
    )
    
    TYPE_CHOICES = (
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    )
    
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    requirements = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    internship_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full-time')
    duration_months = models.IntegerField(default=3)
    stipend = models.CharField(max_length=100, blank=True)
    application_deadline = models.DateField()
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    banner_url = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='internships')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company}"


class InternshipApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('shortlisted', 'Shortlisted'),
    )
    
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=200)
    student_id = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    resume_url = models.URLField(blank=True)
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} -> {self.internship.title} ({self.status})"