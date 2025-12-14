from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, LeaderboardEntry


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'college_name', 'branch', 'roll_number', 'semester', 'date_of_birth', 'gender', 'profile_image']


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = ['id', 'name', 'university', 'points', 'avatar', 'emoji', 'category', 'is_university_entry', 'created_at', 'updated_at']


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # Create empty profile for new user
        UserProfile.objects.create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'last_login', 'date_joined', 'is_staff', 'profile']
    
    def get_profile(self, obj):
        try:
            profile = obj.profile
            return {
                'phone': profile.phone,
                'college_name': profile.college_name,
                'branch': profile.branch,
                'roll_number': profile.roll_number,
                'semester': profile.semester,
                'date_of_birth': profile.date_of_birth.isoformat() if profile.date_of_birth else None,
                'gender': profile.gender,
                'profile_image': profile.profile_image,
            }
        except UserProfile.DoesNotExist:
            return None


class UserWithPasswordSerializer(serializers.ModelSerializer):
    """For admin view - shows that password is set (not actual password)"""
    profile = UserProfileSerializer(read_only=True)
    has_password = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'last_login', 'date_joined', 'is_staff', 'profile', 'has_password']
    
    def get_has_password(self, obj):
        return obj.has_usable_password()

