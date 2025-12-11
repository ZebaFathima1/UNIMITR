from rest_framework import serializers
from .models import Club, ClubJoinRequest

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']

class ClubJoinRequestSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    studentId = serializers.CharField(source='student_id')

    class Meta:
        model = ClubJoinRequest
        fields = ['id', 'club', 'fullName', 'email', 'studentId', 'phone', 'reason', 'status', 'created_at']
        read_only_fields = ['id', 'club', 'status', 'created_at']
