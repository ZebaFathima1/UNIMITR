# UniMitr Backend

Django REST Framework backend for the UniMitr mobile application.

## Features

### Implemented Apps

1. **Authentication (`authapp`)**
   - JWT-based authentication
   - User registration and login
   - Role-based access (Student/Admin)

2. **Events (`events`)**
   - Create and manage university events
   - Event registration system
   - Admin approval workflow
   - Registration management

3. **Clubs (`clubs`)**
   - Student club management
   - Join request system
   - Admin approval for club memberships

4. **Volunteering (`volunteering`)**
   - Volunteering opportunity postings
   - Application system for volunteers
   - Track volunteer hours and participation
   - Admin approval workflow

5. **Internships (`internships`)**
   - Internship opportunity listings
   - Application submission
   - Resume and cover letter support
   - Application status tracking (pending/approved/rejected/shortlisted)

6. **Workshops (`workshops`)**
   - Workshop creation and management
   - Registration system
   - Attendance tracking
   - Support for online/offline/hybrid modes

## Setup Instructions

### Prerequisites
- Python 3.11+
- pip
- Virtual environment (recommended)

### Installation

1. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run setup script:**
   ```bash
   # On Windows
   setup_backend.bat
   
   # On macOS/Linux
   chmod +x setup_backend.sh
   ./setup_backend.sh
   ```

   Or manually:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create superuser (admin account):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run development server:**
   ```bash
   python manage.py runserver 0.0.0.0:4000
   ```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoints and usage.

## Project Structure

```
backend/
├── apps/
│   ├── authapp/          # Authentication
│   ├── events/           # Events management
│   ├── clubs/            # Clubs management
│   ├── volunteering/     # Volunteering opportunities
│   ├── internships/      # Internship postings
│   └── workshops/        # Workshop management
├── unimitr/              # Django project settings
├── db.sqlite3            # SQLite database
├── manage.py             # Django management script
└── requirements.txt      # Python dependencies
```

## Database Models

### Events
- Event (title, description, date, time, location, category, status)
- EventRegistration (user details, status)

### Clubs
- Club (name, description)
- ClubJoinRequest (user details, reason, status)

### Volunteering
- VolunteeringOpportunity (title, organization, location, duration, etc.)
- VolunteeringApplication (user details, motivation, status)

### Internships
- Internship (title, company, requirements, duration, stipend, etc.)
- InternshipApplication (user details, resume, cover letter, status)

### Workshops
- Workshop (title, instructor, date, mode, max participants, etc.)
- WorkshopRegistration (user details, expectations, status)

## Admin Panel

Access the Django admin panel at: `http://localhost:4000/admin/`

Use the superuser credentials created during setup.

## API Testing

1. **Health Check:**
   ```
   GET http://localhost:4000/health/
   ```

2. **API Root:**
   ```
   GET http://localhost:4000/
   ```

3. **Login:**
   ```
   POST http://localhost:4000/api/auth/compat-login/
   Body: { "email": "user@example.com", "role": "student" }
   ```

## Development

### Adding New Features

1. Create a new Django app:
   ```bash
   python manage.py startapp newapp apps/newapp
   ```

2. Add models in `apps/newapp/models.py`

3. Create serializers in `apps/newapp/serializers.py`

4. Create views in `apps/newapp/views.py`

5. Add URLs in `apps/newapp/urls.py`

6. Register app in `unimitr/settings.py` INSTALLED_APPS

7. Include URLs in `unimitr/urls.py`

8. Run migrations:
   ```bash
   python manage.py makemigrations newapp
   python manage.py migrate
   ```

## Environment Variables

Create a `.env` file for production:

```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgres://user:pass@host:port/dbname
```

## Deployment

For production deployment:

1. Set `DEBUG=False` in settings
2. Configure proper `ALLOWED_HOSTS`
3. Use PostgreSQL instead of SQLite
4. Set up proper static file serving
5. Use environment variables for sensitive data
6. Enable HTTPS
7. Set up proper CORS settings

## License

MIT License