from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import SignupSerializer, UserSerializer, UserProfileSerializer, UserWithPasswordSerializer, LeaderboardEntrySerializer
from .models import UserProfile, LeaderboardEntry
from django.db.models import Sum

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Use username as the primary login field; map email -> username for convenience
    username_field = 'username'
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        # Accept either email or username. If a user exists without a usable password,
        # set the provided password once and continue (helps accounts created without password).
        raw_identifier = attrs.get('email') or attrs.get('username')
        password = attrs.get('password')

        # Try to resolve the user by email first, then by username
        user = None
        if raw_identifier:
            try:
                user = User.objects.get(email=raw_identifier)
            except User.DoesNotExist:
                try:
                    user = User.objects.get(username=raw_identifier)
                except User.DoesNotExist:
                    user = None

        if user is not None:
            # If the user has no usable password (e.g., created via compat), set it now
            if password and not user.has_usable_password():
                user.set_password(password)
                user.save(update_fields=['password'])
            # Ensure SimpleJWT authenticates using the username
            attrs['username'] = user.username

        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class UsersListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-last_login', '-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Allow access for admin dashboard

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

class SimpleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        role = request.data.get('role')
        name = request.data.get('name')
        # Optional fields from the current frontend payload
        _student_id = request.data.get('studentId')
        _phone = request.data.get('phone')

        if not email or role not in ['student', 'admin']:
            return Response({'detail': 'email and role are required'}, status=400)

        username = email
        user, created = User.objects.get_or_create(username=username, defaults={'email': email})

        # Update basic fields
        if name:
            parts = name.split()
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = ' '.join(parts[1:])
        if not user.email:
            user.email = email

        # Grant staff for admin role so IsAdminUser permissions pass
        if role == 'admin' and not user.is_staff:
            user.is_staff = True

        # Touch last_login for auditing purposes
        user.last_login = timezone.now()
        user.save()

        refresh = RefreshToken.for_user(user)
        data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }
        return Response(data)


class UserActivityStatsView(APIView):
    """Get user activity stats based on their email - counts approved applications"""
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'detail': 'email parameter is required'}, status=400)
        
        # Import models here to avoid circular imports
        from apps.events.models import EventRegistration
        from apps.workshops.models import WorkshopRegistration
        from apps.volunteering.models import VolunteeringOpportunity, VolunteeringApplication
        from apps.clubs.models import ClubJoinRequest
        
        # Count approved event registrations
        events_attended = EventRegistration.objects.filter(
            email__iexact=email,
            status='approved'
        ).count()
        
        # Count approved workshop registrations
        workshops_completed = WorkshopRegistration.objects.filter(
            email__iexact=email,
            status__in=['approved', 'attended']
        ).count()
        
        # Count approved volunteering applications and sum hours
        volunteering_apps = VolunteeringApplication.objects.filter(
            email__iexact=email,
            status='approved'
        ).select_related('opportunity')
        
        volunteering_hours = 0
        for app in volunteering_apps:
            volunteering_hours += app.opportunity.duration_hours if app.opportunity else 0
        
        # Count approved club memberships as "challenges completed"
        clubs_joined = ClubJoinRequest.objects.filter(
            email__iexact=email,
            status='approved'
        ).count()
        
        return Response({
            'eventsAttended': events_attended,
            'workshopsCompleted': workshops_completed,
            'volunteeringHours': volunteering_hours,
            'challengesCompleted': clubs_joined,  # Using clubs as "challenges"
        })


class UserProfileView(APIView):
    """Get or update user profile by email"""
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'detail': 'email parameter is required'}, status=400)
        
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username__iexact=email)
            except User.DoesNotExist:
                return Response({'detail': 'User not found'}, status=404)
        
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return Response({
            'name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email,
            'phone': profile.phone,
            'collegeName': profile.college_name,
            'branch': profile.branch,
            'rollNumber': profile.roll_number,
            'semester': profile.semester,
            'dateOfBirth': profile.date_of_birth.isoformat() if profile.date_of_birth else '',
            'gender': profile.gender,
            'profileImage': profile.profile_image,
        })

    def post(self, request):
        email = request.data.get('email')
        print(f"[PROFILE SAVE] Received data: {request.data}")  # Debug log
        
        if not email:
            return Response({'detail': 'email is required'}, status=400)
        
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username__iexact=email)
            except User.DoesNotExist:
                return Response({'detail': 'User not found'}, status=404)
        
        print(f"[PROFILE SAVE] Found user: {user.username}")  # Debug log
        
        # Update user name
        name = request.data.get('name', '')
        if name:
            parts = name.split()
            user.first_name = parts[0]
            user.last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
            user.save()
        
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Update profile fields - only update if value is provided (not None)
        if request.data.get('phone') is not None:
            profile.phone = request.data.get('phone') or ''
        if request.data.get('collegeName') is not None:
            profile.college_name = request.data.get('collegeName') or ''
        if request.data.get('branch') is not None:
            profile.branch = request.data.get('branch') or ''
        if request.data.get('rollNumber') is not None:
            profile.roll_number = request.data.get('rollNumber') or ''
        if request.data.get('semester') is not None:
            profile.semester = request.data.get('semester') or ''
        if request.data.get('gender') is not None:
            profile.gender = request.data.get('gender') or ''
        if request.data.get('profileImage') is not None:
            profile.profile_image = request.data.get('profileImage') or ''
        
        # Handle date
        dob = request.data.get('dateOfBirth')
        if dob:
            try:
                from datetime import datetime
                profile.date_of_birth = datetime.strptime(dob, '%Y-%m-%d').date()
            except:
                pass
        
        profile.save()
        
        print(f"[PROFILE SAVE] Saved - Phone:{profile.phone}, College:{profile.college_name}, Branch:{profile.branch}")  # Debug log
        
        return Response({'message': 'Profile saved successfully', 'saved': {
            'phone': profile.phone,
            'collegeName': profile.college_name,
            'branch': profile.branch,
        }})


class AllUsersView(APIView):
    """Get all users with their profiles for admin dashboard"""
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        result = []
        
        for user in users:
            profile = getattr(user, 'profile', None)
            result.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'isStaff': user.is_staff,
                'dateJoined': user.date_joined.isoformat() if user.date_joined else '',
                'lastLogin': user.last_login.isoformat() if user.last_login else '',
                'hasPassword': user.has_usable_password(),
                'profile': {
                    'phone': profile.phone if profile else '',
                    'collegeName': profile.college_name if profile else '',
                    'branch': profile.branch if profile else '',
                    'rollNumber': profile.roll_number if profile else '',
                    'semester': profile.semester if profile else '',
                } if profile else None
            })
        
        return Response(result)


class LeaderboardView(APIView):
    """Get, create, update, delete leaderboard entries"""
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category', 'global')
        
        if category == 'all':
            entries = LeaderboardEntry.objects.all().order_by('category', '-points')
        else:
            entries = LeaderboardEntry.objects.filter(category=category).order_by('-points')
        
        result = []
        for idx, entry in enumerate(entries):
            result.append({
                'id': entry.id,
                'rank': idx + 1,
                'name': entry.name,
                'university': entry.university,
                'points': entry.points,
                'avatar': entry.avatar,
                'emoji': entry.emoji or '⭐',
                'category': entry.category,
                'isUniversity': entry.is_university_entry,
                'is_university_entry': entry.is_university_entry,
            })
        
        return Response(result)
    
    def post(self, request):
        """Create a new leaderboard entry"""
        entry = LeaderboardEntry.objects.create(
            name=request.data.get('name', ''),
            university=request.data.get('university', ''),
            points=request.data.get('points', 0),
            avatar=request.data.get('avatar', ''),
            emoji=request.data.get('emoji', '⭐'),
            category=request.data.get('category', 'global'),
            is_university_entry=request.data.get('is_university_entry', False),
        )
        return Response({'id': entry.id, 'message': 'Created successfully'}, status=201)


class LeaderboardDetailView(APIView):
    """Update or delete a specific leaderboard entry"""
    permission_classes = [AllowAny]

    def put(self, request, pk):
        """Update a leaderboard entry"""
        try:
            entry = LeaderboardEntry.objects.get(pk=pk)
        except LeaderboardEntry.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        
        entry.name = request.data.get('name', entry.name)
        entry.university = request.data.get('university', entry.university)
        entry.points = request.data.get('points', entry.points)
        entry.avatar = request.data.get('avatar', entry.avatar)
        entry.emoji = request.data.get('emoji', entry.emoji)
        entry.category = request.data.get('category', entry.category)
        entry.is_university_entry = request.data.get('is_university_entry', entry.is_university_entry)
        entry.save()
        
        return Response({'id': entry.id, 'message': 'Updated successfully'})

    def delete(self, request, pk):
        """Delete a leaderboard entry"""
        try:
            entry = LeaderboardEntry.objects.get(pk=pk)
            entry.delete()
            return Response({'message': 'Deleted successfully'})
        except LeaderboardEntry.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)

