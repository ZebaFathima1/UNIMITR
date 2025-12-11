from rest_framework import serializers
from .models import Internship, InternshipApplication


class InternshipSerializer(serializers.ModelSerializer):
    bannerUrl = serializers.CharField(source='banner_url', allow_null=True, allow_blank=True, required=False)
    internshipType = serializers.CharField(source='internship_type')
    durationMonths = serializers.IntegerField(source='duration_months')
    applicationDeadline = serializers.DateField(source='application_deadline')

    class Meta:
        model = Internship
        fields = [
            'id', 'title', 'company', 'description', 'requirements', 
            'location', 'internshipType', 'durationMonths', 'stipend', 
            'applicationDeadline', 'category', 'status', 'bannerUrl', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class InternshipApplicationSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    studentId = serializers.CharField(source='student_id')
    resumeUrl = serializers.CharField(source='resume_url', allow_blank=True, required=False)
    coverLetter = serializers.CharField(source='cover_letter', allow_blank=True, required=False)

    class Meta:
        model = InternshipApplication
        fields = ['id', 'internship', 'fullName', 'studentId', 'email', 'phone', 'resumeUrl', 'coverLetter', 'status', 'created_at']
        read_only_fields = ['id', 'internship', 'status', 'created_at']