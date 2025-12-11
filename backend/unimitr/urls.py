from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root(_request):
    return JsonResponse({
        'message': 'UniMitr API',
        'admin': '/admin/',
        'auth': {
            'login': '/api/auth/login/',
            'signup': '/api/auth/signup/',
            'refresh': '/api/auth/refresh/',
            'users': '/api/auth/users/'
        },
        'events': {
            'list': '/api/events/',
            'create': '/api/events/',
            'detail': '/api/events/{id}/',
            'approve': '/api/events/{id}/approve/',
            'reject': '/api/events/{id}/reject/',
            'register': '/api/events/{id}/register/',
            'registrations': '/api/events/{id}/registrations/',
            'approveRegistration': '/api/events/{id}/registrations/{rid}/approve/',
            'rejectRegistration': '/api/events/{id}/registrations/{rid}/reject/'
        },
        'clubs': {
            'list': '/api/clubs/',
            'create': '/api/clubs/',
            'detail': '/api/clubs/{id}/',
            'join': '/api/clubs/{id}/join/',
            'requests': '/api/clubs/{id}/requests/',
            'approveRequest': '/api/clubs/{id}/requests/{rid}/approve/',
            'rejectRequest': '/api/clubs/{id}/requests/{rid}/reject/'
        },
        'volunteering': {
            'list': '/api/volunteering/',
            'create': '/api/volunteering/',
            'detail': '/api/volunteering/{id}/',
            'approve': '/api/volunteering/{id}/approve/',
            'reject': '/api/volunteering/{id}/reject/',
            'apply': '/api/volunteering/{id}/apply/',
            'applications': '/api/volunteering/{id}/applications/',
            'approveApplication': '/api/volunteering/{id}/applications/{aid}/approve/',
            'rejectApplication': '/api/volunteering/{id}/applications/{aid}/reject/'
        },
        'internships': {
            'list': '/api/internships/',
            'create': '/api/internships/',
            'detail': '/api/internships/{id}/',
            'approve': '/api/internships/{id}/approve/',
            'reject': '/api/internships/{id}/reject/',
            'apply': '/api/internships/{id}/apply/',
            'applications': '/api/internships/{id}/applications/',
            'approveApplication': '/api/internships/{id}/applications/{aid}/approve/',
            'rejectApplication': '/api/internships/{id}/applications/{aid}/reject/',
            'shortlistApplication': '/api/internships/{id}/applications/{aid}/shortlist/'
        },
        'workshops': {
            'list': '/api/workshops/',
            'create': '/api/workshops/',
            'detail': '/api/workshops/{id}/',
            'approve': '/api/workshops/{id}/approve/',
            'reject': '/api/workshops/{id}/reject/',
            'register': '/api/workshops/{id}/register/',
            'registrations': '/api/workshops/{id}/registrations/',
            'approveRegistration': '/api/workshops/{id}/registrations/{rid}/approve/',
            'rejectRegistration': '/api/workshops/{id}/registrations/{rid}/reject/',
            'markAttended': '/api/workshops/{id}/registrations/{rid}/mark-attended/'
        },
        'health': '/health/'
    })

urlpatterns = [
    path('', root),
    path('health/', lambda _r: JsonResponse({'ok': True})),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authapp.urls')),
    path('api/', include('apps.events.urls')),
    path('api/', include('apps.clubs.urls')),
    path('api/', include('apps.volunteering.urls')),
    path('api/', include('apps.internships.urls')),
    path('api/', include('apps.workshops.urls')),
]
