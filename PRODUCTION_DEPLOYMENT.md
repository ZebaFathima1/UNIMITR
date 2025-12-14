# 🎯 Production Deployment - Commands & Setup

## Requirements

Before deploying, ensure you have:

```bash
# Check Python version (should be 3.8+)
python --version

# Check Node version (should be 14+)
node --version

# Install Gunicorn (production WSGI server)
cd backend
pip install gunicorn
```

---

## Development Deployment (Using Django Dev Server)

### Quick Deployment (1 command per step):

```powershell
# Windows PowerShell - Run from root directory

# 1. Clean and build
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
npm install
npm run build

# 2. Copy React build to Django
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# 3. Collect static files
cd backend
python manage.py collectstatic --noinput

# 4. Run development server
python manage.py runserver 0.0.0.0:8000
```

### Linux/Mac Version:

```bash
# 1. Clean and build
rm -rf build
npm install
npm run build

# 2. Copy React build to Django
cp -r build/* backend/staticfiles_build/frontend/

# 3. Collect static files
cd backend
python manage.py collectstatic --noinput

# 4. Run development server
python manage.py runserver 0.0.0.0:8000
```

---

## Production Deployment (Using Gunicorn)

### Step 1: Install Gunicorn

```bash
cd backend
pip install gunicorn
pip freeze > requirements.txt  # Update requirements
```

### Step 2: Create Gunicorn Configuration

**File**: `backend/gunicorn_config.py`

```python
"""
Gunicorn configuration file for UniMitr production deployment
"""

import multiprocessing
import os

# Server socket binding
bind = "0.0.0.0:8000"  # Listen on all interfaces, port 8000

# Workers (processes)
# Rule: (2 × CPU cores) + 1
workers = (multiprocessing.cpu_count() * 2) + 1

# Worker class
worker_class = "sync"  # Synchronous workers (good for most cases)

# Worker timeout (seconds) - increase if you have slow requests
timeout = 30

# Max requests per worker before restart (prevents memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = "info"

# Process naming
proc_name = "unimitr"

# Settings
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Application
# Gunicorn will load the WSGI application from unimitr.wsgi
application = "unimitr.wsgi"

# SSL (if needed, uncomment and set paths)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"
# ssl_version = "TLSv1_2"
```

### Step 3: Full Production Deployment Commands

```bash
# From root directory

# 1. Build React
npm install
npm run build

# 2. Copy to Django
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# 3. Go to backend
cd backend

# 4. Install dependencies (from requirements.txt)
pip install -r requirements.txt
pip install gunicorn  # Ensure Gunicorn is installed

# 5. Collect static files
python manage.py collectstatic --noinput

# 6. Migrate database (if needed)
python manage.py migrate

# 7. Create superuser (only if first time)
# python manage.py createsuperuser

# 8. Run with Gunicorn
gunicorn -c gunicorn_config.py unimitr.wsgi:application
```

---

## Production Deployment with Nginx (Reverse Proxy)

### Architecture:

```
User Browser
    ↓
http://localhost:80 (Nginx)
    ↓
http://127.0.0.1:8000 (Gunicorn + Django)
```

### Nginx Configuration

**File**: `/etc/nginx/sites-available/unimitr.conf`

```nginx
# Nginx reverse proxy configuration for UniMitr

upstream unimitr_app {
    # Gunicorn processes listening on port 8000
    server 127.0.0.1:8000 fail_timeout=0;
}

server {
    listen 80;
    server_name example.com www.example.com;
    
    # Redirect HTTP to HTTPS (uncomment if using HTTPS)
    # return 301 https://$server_name$request_uri;
    
    client_max_body_size 10M;
    
    # Serve static files directly from Nginx (faster)
    location /static/ {
        alias /path/to/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve media files
    location /media/ {
        alias /path/to/backend/media/;
        expires 7d;
    }
    
    # Proxy all other requests to Gunicorn
    location / {
        proxy_pass http://unimitr_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# HTTPS Configuration (optional)
# server {
#     listen 443 ssl;
#     server_name example.com www.example.com;
#
#     ssl_certificate /path/to/certificate.crt;
#     ssl_certificate_key /path/to/private.key;
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers HIGH:!aNULL:!MD5;
#
#     # ... rest of configuration same as above ...
# }
```

### Enable Nginx Site:

```bash
# Linux
sudo ln -s /etc/nginx/sites-available/unimitr.conf /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx

# Or manually
sudo service nginx restart
```

---

## Using Systemd Service (Production Auto-Start)

### Create Systemd Service File

**File**: `/etc/systemd/system/unimitr.service`

```ini
[Unit]
Description=UniMitr Django Application
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend

# Environment variables
Environment="PATH=/path/to/venv/bin"

# Start command
ExecStart=/path/to/venv/bin/gunicorn \
    --workers 4 \
    --bind 127.0.0.1:8000 \
    --timeout 30 \
    --access-logfile - \
    --error-logfile - \
    unimitr.wsgi:application

# Auto-restart on failure
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Enable & Start Service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable unimitr

# Start the service
sudo systemctl start unimitr

# Check status
sudo systemctl status unimitr

# View logs
sudo journalctl -u unimitr -f  # Follow logs in real-time
```

---

## Docker Deployment (Optional)

### Dockerfile

**File**: `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install -r requirements.txt gunicorn

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "unimitr.wsgi:application"]
```

### Build & Run Docker:

```bash
# Build image
docker build -t unimitr:latest -f backend/Dockerfile backend/

# Run container
docker run -p 8000:8000 -e DEBUG=False -e SECRET_KEY=your-secret-key unimitr:latest

# With volume mount for persistence
docker run -p 8000:8000 \
    -v /path/to/db:/app \
    -e DEBUG=False \
    -e SECRET_KEY=your-secret-key \
    unimitr:latest
```

---

## Environment Variables (Production)

Create **`backend/.env`** file:

```env
DEBUG=False
SECRET_KEY=your-very-secret-key-generate-one
ALLOWED_HOSTS=example.com,www.example.com,localhost
CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com
DATABASE_URL=postgresql://user:password@db-host:5432/unimitr_db
```

Update **`backend/unimitr/settings.py`**:

```python
import os
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY', default='dev-insecure-key')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='').split(',')
```

Install python-decouple:

```bash
pip install python-decouple
```

---

## Database Setup for Production

### Switch to PostgreSQL (Recommended)

```bash
# Install PostgreSQL
pip install psycopg2-binary

# Update settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'unimitr_db',
        'USER': 'postgres',
        'PASSWORD': 'your-password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Migrate
python manage.py migrate
```

---

## Performance Optimization

### Update Django Settings:

```python
# settings.py

# Caching
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# Session cache
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

# Security headers
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Compression
MIDDLEWARE += ['django.middleware.gzip.GZipMiddleware']

# Static files compression
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'
```

---

## Health Check Endpoint

Already included in your urls.py:

```bash
curl http://localhost:8000/health/
# Response: {"ok": true}
```

Use this with load balancers or monitoring tools.

---

## Deployment Checklist

- [ ] `DEBUG = False` in settings.py
- [ ] `SECRET_KEY` set to secure random value
- [ ] `ALLOWED_HOSTS` configured correctly
- [ ] Database migrated (`python manage.py migrate`)
- [ ] Superuser created (`python manage.py createsuperuser`)
- [ ] Static files collected (`python manage.py collectstatic --noinput`)
- [ ] React built and copied (`npm run build && copy...`)
- [ ] Gunicorn installed (`pip install gunicorn`)
- [ ] Environment variables set in `.env`
- [ ] CORS settings reviewed and configured
- [ ] HTTPS/SSL configured (if needed)
- [ ] Database backups set up
- [ ] Log rotation configured
- [ ] Monitoring & alerting set up
- [ ] All URLs accessible and working

---

## Monitoring & Logs

### View Gunicorn Logs:

```bash
# Last 50 lines
tail -50 /var/log/unimitr/gunicorn.log

# Follow logs in real-time
tail -f /var/log/unimitr/gunicorn.log

# Search for errors
grep "ERROR" /var/log/unimitr/gunicorn.log
```

### Check Application Status:

```bash
# Is app running?
curl http://localhost:8000/health/

# Check response time
time curl http://localhost:8000/api/events/

# Monitor process
ps aux | grep gunicorn
```

---

## Troubleshooting Production Issues

### Problem: "502 Bad Gateway" from Nginx

```bash
# Check if Gunicorn is running
ps aux | grep gunicorn

# Check Gunicorn logs
tail -f /var/log/unimitr/gunicorn.log

# Test Gunicorn socket
curl http://127.0.0.1:8000/health/
```

### Problem: Static files not loading (404)

```bash
# Ensure collectstatic was run
python manage.py collectstatic --noinput

# Check STATIC_ROOT path
python manage.py shell
>>> from django.conf import settings
>>> print(settings.STATIC_ROOT)
>>> import os
>>> os.path.exists(settings.STATIC_ROOT)
```

### Problem: Database connection error

```bash
# Test database
python manage.py dbshell

# Run migrations
python manage.py migrate

# Check database settings
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
```

---

## Rollback Procedure

If something goes wrong:

```bash
# Stop the application
sudo systemctl stop unimitr

# Restore from backup
cp backup/db.sqlite3 backend/db.sqlite3

# Restart
sudo systemctl start unimitr

# Verify
curl http://localhost:8000/health/
```

---

## Next Steps After Deployment

1. **Monitor**: Set up application monitoring (New Relic, DataDog, etc.)
2. **Logging**: Centralize logs (ELK stack, Sentry, etc.)
3. **Backups**: Automate database backups (daily, weekly)
4. **SSL/HTTPS**: Install SSL certificate (Let's Encrypt free option)
5. **CI/CD**: Automate deployments (GitHub Actions, GitLab CI)
6. **Analytics**: Track user behavior (Google Analytics, Mixpanel)
7. **Performance**: Optimize slow queries, add caching

---

**Production deployment complete! 🚀**
