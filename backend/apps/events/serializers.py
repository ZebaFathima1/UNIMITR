from rest_framework import serializers
from .models import Event, EventRegistration

class EventSerializer(serializers.ModelSerializer):
    bannerUrl = serializers.CharField(source='banner_url', allow_null=True, allow_blank=True, required=False)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'time', 'location', 'category', 'status', 'bannerUrl', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class EventRegistrationSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    studentId = serializers.CharField(source='student_id')
    status = serializers.CharField(read_only=True)

    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'fullName', 'studentId', 'email', 'phone', 'status', 'created_at']
        read_only_fields = ['id', 'created_at', 'event', 'status']
