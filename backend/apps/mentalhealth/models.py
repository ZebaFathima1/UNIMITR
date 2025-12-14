from django.db import models
from django.contrib.auth.models import User


class Counsellor(models.Model):
    """Professional counsellors for mental health support"""
    name = models.CharField(max_length=200)
    specialization = models.CharField(max_length=200)
    avatar = models.CharField(max_length=10, blank=True)  # Initials
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.5)
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.specialization}"


class CounsellorSlot(models.Model):
    """Available time slots for counsellors"""
    counsellor = models.ForeignKey(Counsellor, on_delete=models.CASCADE, related_name='slots')
    time_slot = models.CharField(max_length=20)  # e.g., "10:00 AM"
    day = models.CharField(max_length=20, default='Any')  # e.g., "Monday"
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.counsellor.name} - {self.time_slot}"


class CounsellingAppointment(models.Model):
    """Booked appointments for counselling"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    counsellor = models.ForeignKey(Counsellor, on_delete=models.CASCADE)
    user_email = models.EmailField()
    slot = models.CharField(max_length=20)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user_email} - {self.counsellor.name} at {self.slot}"


class AnonymousChatSession(models.Model):
    """Anonymous peer support chat sessions (metadata only, no messages stored)"""
    session_id = models.CharField(max_length=100, unique=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)

    def __str__(self):
        return f"Session {self.session_id}"
