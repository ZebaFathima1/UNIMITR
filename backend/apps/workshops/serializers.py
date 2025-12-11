from rest_framework import serializers
from .models import Workshop, WorkshopRegistration


class WorkshopSerializer(serializers.ModelSerializer):
    bannerUrl = serializers.CharField(source='banner_url', allow_null=True, allow_blank=True, required=False)
    durationHours = serializers.IntegerField(source='duration_hours')
    maxParticipants = serializers.IntegerField(source='max_participants')

    class Meta:
        model = Workshop
        fields = [
            'id', 'title', 'description', 'instructor', 'organization', 
            'date', 'time', 'durationHours', 'location', 'mode', 
            'maxParticipants', 'fee', 'category', 'status', 'bannerUrl', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class WorkshopRegistrationSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    studentId = serializers.CharField(source='student_id')

    class Meta:
        model = WorkshopRegistration
        fields = ['id', 'workshop', 'fullName', 'studentId', 'email', 'phone', 'expectations', 'status', 'created_at']
        read_only_fields = ['id', 'workshop', 'status', 'created_at']