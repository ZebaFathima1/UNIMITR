# Restrict admin login to only the specified username and password
ADMIN_USERNAME = 'admin'  # Change as needed
ADMIN_PASSWORD = 'admin123'  # Change as needed

# Use custom backend for admin login restriction
AUTHENTICATION_BACKENDS = [
    'apps.authapp.admin_backend.OnlyAdminBackend',
    'django.contrib.auth.backends.ModelBackend',
]
from pathlib import Path
import os
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-insecure-secret')
DEBUG = True
ALLOWED_HOSTS = ['*']

# Path to React build files
REACT_BUILD_DIR = BASE_DIR / 'staticfiles_build' / 'frontend'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'apps.authapp.apps.AuthappConfig',
    'apps.events.apps.EventsConfig',
    'apps.clubs.apps.ClubsConfig',
    'apps.volunteering.apps.VolunteeringConfig',
    'apps.internships.apps.InternshipsConfig',
    'apps.workshops.apps.WorkshopsConfig',
    'apps.mentalhealth.apps.MentalhealthConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration - Allow all origins since frontend and backend are on same server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",  # For development
]
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = 'unimitr.urls'

# Path to React build folder
# Path to React build files
REACT_BUILD_DIR = BASE_DIR / 'staticfiles_build' / 'frontend'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [str(REACT_BUILD_DIR)],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'unimitr.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    REACT_BUILD_DIR,
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
