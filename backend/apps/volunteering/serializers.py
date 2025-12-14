from rest_framework import serializers
from .models import VolunteeringOpportunity, VolunteeringApplication


class VolunteeringOpportunitySerializer(serializers.ModelSerializer):
    bannerUrl = serializers.CharField(source='banner_url', allow_null=True, allow_blank=True, required=False)
    durationHours = serializers.IntegerField(source='duration_hours')
    requiredVolunteers = serializers.IntegerField(source='required_volunteers')

    class Meta:
        model = VolunteeringOpportunity
        fields = [
            'id', 'title', 'description', 'organization', 'location', 
            'date', 'time', 'durationHours', 'requiredVolunteers', 
            'category', 'status', 'bannerUrl', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VolunteeringApplicationSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    studentId = serializers.CharField(source='student_id')

    class Meta:
        model = VolunteeringApplication
        fields = ['id', 'opportunity', 'fullName', 'studentId', 'email', 'phone', 'motivation', 'status', 'created_at']
        read_only_fields = ['id', 'opportunity', 'status', 'created_at']