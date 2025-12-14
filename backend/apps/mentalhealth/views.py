from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Counsellor, CounsellorSlot, CounsellingAppointment


class CounsellorListView(APIView):
    """Get list of counsellors - supports CRUD for admin"""
    permission_classes = [AllowAny]

    def get(self, request):
        """Get all counsellors (for admin, includes all; for users, only available)"""
        # For admin, return all counsellors
        counsellors = Counsellor.objects.all()
        
        result = []
        for c in counsellors:
            # Get available slots
            slots = CounsellorSlot.objects.filter(counsellor=c, is_available=True).values_list('time_slot', flat=True)
            
            result.append({
                'id': c.id,
                'name': c.name,
                'avatar': c.avatar or (c.name[:2].upper() if c.name else '??'),
                'rating': float(c.rating),
                'bio': c.bio,
                'is_available': c.is_available,
                'available_slots': list(slots) if slots else ['10:00 AM', '2:00 PM', '4:00 PM'],
            })
        
        return Response(result)

    def post(self, request):
        """Create a new counsellor"""
        name = request.data.get('name')
        specialization = request.data.get('specialization', 'General Wellness')
        bio = request.data.get('bio', '')
        rating = request.data.get('rating', 4.5)
        is_available = request.data.get('is_available', True)
        avatar = request.data.get('avatar', '')

        if not name:
            return Response({'detail': 'name is required'}, status=400)

        counsellor = Counsellor.objects.create(
            name=name,
            specialization=specialization,
            bio=bio,
            rating=rating,
            is_available=is_available,
            avatar=avatar or name[:2].upper()
        )

        return Response({
            'id': counsellor.id,
            'name': counsellor.name,
            'specialization': counsellor.specialization,
            'avatar': counsellor.avatar,
            'rating': float(counsellor.rating),
            'bio': counsellor.bio,
            'is_available': counsellor.is_available,
        }, status=201)


class CounsellorDetailView(APIView):
    """Update/Delete individual counsellor"""
    permission_classes = [AllowAny]

    def get(self, request, pk):
        """Get single counsellor"""
        try:
            c = Counsellor.objects.get(pk=pk)
            return Response({
                'id': c.id,
                'name': c.name,
                'specialization': c.specialization,
                'avatar': c.avatar,
                'rating': float(c.rating),
                'bio': c.bio,
                'is_available': c.is_available,
            })
        except Counsellor.DoesNotExist:
            return Response({'detail': 'Counsellor not found'}, status=404)

    def put(self, request, pk):
        """Update a counsellor"""
        try:
            counsellor = Counsellor.objects.get(pk=pk)
        except Counsellor.DoesNotExist:
            return Response({'detail': 'Counsellor not found'}, status=404)

        counsellor.name = request.data.get('name', counsellor.name)
        counsellor.specialization = request.data.get('specialization', counsellor.specialization)
        counsellor.bio = request.data.get('bio', counsellor.bio)
        counsellor.rating = request.data.get('rating', counsellor.rating)
        counsellor.is_available = request.data.get('is_available', counsellor.is_available)
        counsellor.avatar = request.data.get('avatar', counsellor.avatar)
        counsellor.save()

        return Response({
            'id': counsellor.id,
            'name': counsellor.name,
            'specialization': counsellor.specialization,
            'avatar': counsellor.avatar,
            'rating': float(counsellor.rating),
            'bio': counsellor.bio,
            'is_available': counsellor.is_available,
        })

    def delete(self, request, pk):
        """Delete a counsellor"""
        try:
            counsellor = Counsellor.objects.get(pk=pk)
            counsellor.delete()
            return Response({'detail': 'Counsellor deleted'}, status=204)
        except Counsellor.DoesNotExist:
            return Response({'detail': 'Counsellor not found'}, status=404)


class AppointmentView(APIView):
    """Book and manage counselling appointments"""
    permission_classes = [AllowAny]

    def get(self, request):
        """Get appointments - all for admin, filtered by email for users"""
        email = request.query_params.get('email')
        all_appointments = request.query_params.get('all')  # For admin to see all
        
        if all_appointments == 'true':
            # Admin view - return all appointments
            appointments = CounsellingAppointment.objects.all().order_by('-date', '-id')
        elif email:
            # User view - return only their appointments
            appointments = CounsellingAppointment.objects.filter(user_email__iexact=email)
        else:
            # Default - return all for admin
            appointments = CounsellingAppointment.objects.all().order_by('-date', '-id')
        
        result = []
        for a in appointments:
            result.append({
                'id': a.id,
                'counsellor': a.counsellor.name,
                'counsellor_id': a.counsellor.id,
                'specialization': a.counsellor.specialization,
                'user_email': a.user_email,
                'slot': a.slot,
                'date': a.date.isoformat(),
                'status': a.status,
                'notes': a.notes or '',
            })
        
        return Response(result)

    def post(self, request):
        """Book a new appointment"""
        counsellor_id = request.data.get('counsellor_id')
        slot = request.data.get('slot')
        email = request.data.get('email')

        if not all([counsellor_id, slot, email]):
            return Response({'detail': 'counsellor_id, slot, and email are required'}, status=400)

        try:
            counsellor = Counsellor.objects.get(id=counsellor_id)
        except Counsellor.DoesNotExist:
            return Response({'detail': 'Counsellor not found'}, status=404)

        appointment = CounsellingAppointment.objects.create(
            counsellor=counsellor,
            user_email=email,
            slot=slot,
            status='confirmed'
        )

        return Response({
            'id': appointment.id,
            'message': 'Appointment booked successfully',
            'counsellor': counsellor.name,
            'slot': slot,
        }, status=201)


class AppointmentDetailView(APIView):
    """Update/Delete individual appointment"""
    permission_classes = [AllowAny]

    def put(self, request, pk):
        """Update appointment status"""
        try:
            appointment = CounsellingAppointment.objects.get(pk=pk)
        except CounsellingAppointment.DoesNotExist:
            return Response({'detail': 'Appointment not found'}, status=404)

        appointment.status = request.data.get('status', appointment.status)
        appointment.notes = request.data.get('notes', appointment.notes)
        appointment.save()

        return Response({
            'id': appointment.id,
            'status': appointment.status,
            'notes': appointment.notes,
        })

    def delete(self, request, pk):
        """Delete/Cancel appointment"""
        try:
            appointment = CounsellingAppointment.objects.get(pk=pk)
            appointment.delete()
            return Response({'detail': 'Appointment cancelled'}, status=204)
        except CounsellingAppointment.DoesNotExist:
            return Response({'detail': 'Appointment not found'}, status=404)
