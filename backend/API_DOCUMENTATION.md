# UniMitr Backend API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Apps Overview

### 1. Events App
Manages university events and registrations.

**Endpoints:**
- `GET /api/events/` - List all events (supports ?status=published|draft|approved|rejected)
- `POST /api/events/` - Create event (Admin only)
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event (Admin only)
- `DELETE /api/events/{id}/` - Delete event (Admin only)
- `POST /api/events/{id}/approve/` - Approve event (Admin only)
- `POST /api/events/{id}/reject/` - Reject event (Admin only)
- `POST /api/events/{id}/register/` - Register for event
- `GET /api/events/{id}/registrations/` - List event registrations (Admin only)
- `POST /api/events/{id}/registrations/{rid}/approve/` - Approve registration (Admin only)
- `POST /api/events/{id}/registrations/{rid}/reject/` - Reject registration (Admin only)

### 2. Clubs App
Manages student clubs and join requests.

**Endpoints:**
- `GET /api/clubs/` - List all clubs
- `POST /api/clubs/` - Create club (Admin only)
- `GET /api/clubs/{id}/` - Get club details
- `PUT /api/clubs/{id}/` - Update club (Admin only)
- `DELETE /api/clubs/{id}/` - Delete club (Admin only)
- `POST /api/clubs/{id}/join/` - Submit join request
- `GET /api/clubs/{id}/requests/` - List join requests (Admin only)
- `POST /api/clubs/{id}/requests/{rid}/approve/` - Approve join request (Admin only)
- `POST /api/clubs/{id}/requests/{rid}/reject/` - Reject join request (Admin only)

### 3. Volunteering App
Manages volunteering opportunities and applications.

**Endpoints:**
- `GET /api/volunteering/` - List all opportunities (supports ?status filter)
- `POST /api/volunteering/` - Create opportunity (Admin only)
- `GET /api/volunteering/{id}/` - Get opportunity details
- `PUT /api/volunteering/{id}/` - Update opportunity (Admin only)
- `DELETE /api/volunteering/{id}/` - Delete opportunity (Admin only)
- `POST /api/volunteering/{id}/approve/` - Approve opportunity (Admin only)
- `POST /api/volunteering/{id}/reject/` - Reject opportunity (Admin only)
- `POST /api/volunteering/{id}/close/` - Close opportunity (Admin only)
- `POST /api/volunteering/{id}/apply/` - Apply for opportunity
- `GET /api/volunteering/{id}/applications/` - List applications (Admin only)
- `POST /api/volunteering/{id}/applications/{aid}/approve/` - Approve application (Admin only)
- `POST /api/volunteering/{id}/applications/{aid}/reject/` - Reject application (Admin only)

### 4. Internships App
Manages internship postings and applications.

**Endpoints:**
- `GET /api/internships/` - List all internships (supports ?status filter)
- `POST /api/internships/` - Create internship (Admin only)
- `GET /api/internships/{id}/` - Get internship details
- `PUT /api/internships/{id}/` - Update internship (Admin only)
- `DELETE /api/internships/{id}/` - Delete internship (Admin only)
- `POST /api/internships/{id}/approve/` - Approve internship (Admin only)
- `POST /api/internships/{id}/reject/` - Reject internship (Admin only)
- `POST /api/internships/{id}/close/` - Close internship (Admin only)
- `POST /api/internships/{id}/apply/` - Apply for internship
- `GET /api/internships/{id}/applications/` - List applications (Admin only)
- `POST /api/internships/{id}/applications/{aid}/approve/` - Approve application (Admin only)
- `POST /api/internships/{id}/applications/{aid}/reject/` - Reject application (Admin only)
- `POST /api/internships/{id}/applications/{aid}/shortlist/` - Shortlist application (Admin only)

### 5. Workshops App
Manages workshops and registrations.

**Endpoints:**
- `GET /api/workshops/` - List all workshops (supports ?status filter)
- `POST /api/workshops/` - Create workshop (Admin only)
- `GET /api/workshops/{id}/` - Get workshop details
- `PUT /api/workshops/{id}/` - Update workshop (Admin only)
- `DELETE /api/workshops/{id}/` - Delete workshop (Admin only)
- `POST /api/workshops/{id}/approve/` - Approve workshop (Admin only)
- `POST /api/workshops/{id}/reject/` - Reject workshop (Admin only)
- `POST /api/workshops/{id}/complete/` - Mark workshop as completed (Admin only)
- `POST /api/workshops/{id}/register/` - Register for workshop
- `GET /api/workshops/{id}/registrations/` - List registrations (Admin only)
- `POST /api/workshops/{id}/registrations/{rid}/approve/` - Approve registration (Admin only)
- `POST /api/workshops/{id}/registrations/{rid}/reject/` - Reject registration (Admin only)
- `POST /api/workshops/{id}/registrations/{rid}/mark-attended/` - Mark as attended (Admin only)

## Running Migrations

After setting up the backend, run these commands to create database tables:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Create admin account
python manage.py runserver 0.0.0.0:4000
```

## Testing the API

You can test the API using:
1. Django Admin Panel: http://localhost:4000/admin/
2. API Root: http://localhost:4000/
3. Health Check: http://localhost:4000/health/

## Common Response Formats

### Success Response
```json
{
  "id": 1,
  "title": "Example",
  ...
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

### List Response
```json
[
  {
    "id": 1,
    "title": "Example 1"
  },
  {
    "id": 2,
    "title": "Example 2"
  }
]
```