# ✅ Complete Integration Checklist & Verification Guide

## Pre-Deployment Checklist

### Backend Setup
- [ ] Django project structure is correct (`backend/unimitr/`, `apps/`)
- [ ] `backend/requirements.txt` contains all dependencies
  ```bash
  Django>=5.0
  djangorestframework>=3.14
  django-cors-headers>=4.0
  djangorestframework-simplejwt>=5.0
  ```
- [ ] Database migrations are up to date
  ```bash
  cd backend
  python manage.py migrate
  ```
- [ ] Superuser is created (for admin access)
  ```bash
  python manage.py createsuperuser
  ```

### Frontend Setup
- [ ] React project compiles without errors
  ```bash
  npm install
  npm run build
  ```
- [ ] Build folder created: `build/`
  - [ ] `build/index.html` exists
  - [ ] `build/assets/` contains JS and CSS files
  - [ ] `build/manifest.json` exists

### Configuration Files
- [ ] `backend/unimitr/settings.py`:
  - [ ] `REACT_BUILD_DIR = BASE_DIR / 'staticfiles_build' / 'frontend'`
  - [ ] `TEMPLATES['DIRS']` includes `REACT_BUILD_DIR`
  - [ ] `STATIC_URL = '/static/'`
  - [ ] `STATIC_ROOT = BASE_DIR / 'staticfiles'`
  - [ ] `STATICFILES_DIRS = [REACT_BUILD_DIR]`
  - [ ] `corsheaders` in `INSTALLED_APPS`
  - [ ] `corsheaders.middleware.CorsMiddleware` in `MIDDLEWARE`
  - [ ] `CORS_ALLOWED_ORIGINS` configured

- [ ] `backend/unimitr/urls.py`:
  - [ ] Root endpoint at `path('', root)`
  - [ ] Admin at `path('admin/', admin.site.urls)`
  - [ ] API routes: `path('api/...', include(...))`
  - [ ] React fallback as LAST route: `re_path(r'^(?!api|admin|static|media).*$', serve_react_index)`

- [ ] `backend/unimitr/views.py`:
  - [ ] `serve_react_index()` function defined
  - [ ] Function reads from `settings.REACT_BUILD_DIR / 'index.html'`
  - [ ] Returns proper error if file not found

- [ ] `src/lib/api.ts`:
  - [ ] `getApiBaseUrl()` checks environment
  - [ ] Development: returns `'http://localhost:8000/api'`
  - [ ] Production: returns `'/api'`

- [ ] `vite.config.ts`:
  - [ ] Build output: `outDir: 'build'`

---

## Step-by-Step Deployment

### Phase 1: Prepare (5 minutes)

```bash
# 1. Navigate to project root
cd "Uniमित्र Mobile App Design"

# 2. Verify Python version (3.8+)
python --version

# 3. Verify Node version (14+)
node --version

# 4. Check if virtual environment exists
# (if not, create one)
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
```

### Phase 2: Backend Setup (2 minutes)

```bash
# 1. Install backend dependencies
cd backend
pip install -r requirements.txt

# 2. Migrate database
python manage.py migrate

# 3. Create superuser (first time only)
# python manage.py createsuperuser

# 4. Return to root
cd ..
```

### Phase 3: Frontend Build (3 minutes)

```bash
# 1. Install frontend dependencies
npm install

# 2. Build React
npm run build

# 3. Verify build output
# Check that build/index.html exists
# dir build\  # Windows
# ls build/   # Linux/Mac
```

### Phase 4: Integration (1 minute)

```powershell
# Windows PowerShell - Copy build to Django
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# Linux/Mac bash
# cp -r build/* backend/staticfiles_build/frontend/
```

### Phase 5: Collect Static Files (1 minute)

```bash
cd backend
python manage.py collectstatic --noinput
cd ..
```

### Phase 6: Start Server (30 seconds)

```bash
# Development server (for testing)
cd backend
python manage.py runserver 0.0.0.0:8000

# Or with more verbosity
python manage.py runserver 0.0.0.0:8000 --verbosity 2
```

---

## Post-Deployment Verification

### ✅ Test All URLs

Open your browser and verify each URL:

| URL | Expected Result | Status |
|-----|-----------------|--------|
| `http://localhost:8000/` | JSON with API endpoints | ✓ |
| `http://localhost:8000/health/` | `{"ok": true}` | ✓ |
| `http://localhost:8000/admin/` | Django admin login page | ✓ |
| `http://localhost:8000/login` | React login page (not 404) | ✓ |
| `http://localhost:8000/dashboard` | React dashboard (not 404) | ✓ |
| `http://localhost:8000/api/events/` | JSON list of events | ✓ |
| `http://localhost:8000/api/clubs/` | JSON list of clubs | ✓ |
| `http://localhost:8000/static/` | 403 or directory listing | ✓ |

### ✅ Browser Console Check

Open browser DevTools (F12) and check:

- [ ] No JavaScript errors in Console tab
- [ ] No 404 errors for CSS/JS files in Network tab
- [ ] React app initializes (check React DevTools if installed)
- [ ] API requests show 200 status

### ✅ Functionality Tests

1. **Frontend renders:**
   - [ ] Page loads without errors
   - [ ] Navigation bar appears
   - [ ] Bottom navigation (mobile) appears

2. **Navigation works:**
   - [ ] Click "Events" → EventsPage loads
   - [ ] Click "Clubs" → ClubsPage loads
   - [ ] Click "Workshops" → WorkshopsPage loads
   - [ ] Click "Volunteering" → VolunteeringPage loads

3. **Data displays:**
   - [ ] Events list shows (or "No events" if empty)
   - [ ] Clubs list shows (or "No clubs" if empty)
   - [ ] API calls appear in Network tab

4. **Admin works:**
   - [ ] Visit `/admin/`
   - [ ] Login with superuser credentials
   - [ ] Can create/edit/delete events, clubs, etc.
   - [ ] Changes appear in React frontend (after refresh)

---

## Troubleshooting Guide

### Problem: React doesn't load (404)

**Symptoms:**
- Blank page or "Not Found" error
- Console shows 404 for `/`

**Diagnosis:**
```bash
# Check if React build exists
dir backend\staticfiles_build\frontend\
# Should show: index.html, assets/, manifest.json

# Check Django settings
python manage.py shell
>>> from django.conf import settings
>>> print(settings.REACT_BUILD_DIR)
>>> import os
>>> os.path.exists(settings.REACT_BUILD_DIR / 'index.html')
```

**Fix:**
```bash
# Rebuild React
npm run build

# Copy to Django
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# Restart Django
python manage.py runserver 0.0.0.0:8000
```

---

### Problem: CSS/JS files not loading (404)

**Symptoms:**
- Page loads but unstyled
- Network tab shows 404 for `/static/assets/...`

**Diagnosis:**
```bash
# Check static files collected
dir backend\staticfiles\
# Should contain frontend/ folder with assets/

# Check STATICFILES_DIRS in settings
python manage.py shell
>>> from django.conf import settings
>>> print(settings.STATICFILES_DIRS)
>>> print(settings.STATIC_ROOT)
```

**Fix:**
```bash
# Collect static files
cd backend
python manage.py collectstatic --noinput --clear

# Check that files exist
dir staticfiles\frontend\assets\
```

---

### Problem: API returns 404

**Symptoms:**
- React loads, but API calls fail
- Network tab shows 404 for `/api/events/`

**Diagnosis:**
```bash
# Test API endpoint
curl http://localhost:8000/api/events/
# Should return JSON, not 404

# Check API URLs are configured
# Review backend/apps/events/urls.py
# Review backend/unimitr/urls.py
```

**Fix:**
```bash
# Verify Django server is running
# Verify API routes are included in urls.py
# Try accessing /health/ to test connectivity
curl http://localhost:8000/health/
```

---

### Problem: Can't access Django admin

**Symptoms:**
- Visit `/admin/` → 404 or wrong page

**Diagnosis:**
```bash
# Check URL patterns in urls.py
# Admin should be: path('admin/', admin.site.urls)
# Should come BEFORE React fallback route

# Check Django admin app is installed
python manage.py shell
>>> from django.contrib import admin
>>> print(admin.site.is_registered(__import__('django.contrib.auth.models', fromlist=['User']).User))
```

**Fix:**
```bash
# Ensure Django admin is enabled in INSTALLED_APPS
# Ensure path('admin/', ...) comes before re_path(...) for React

# Restart Django
python manage.py runserver 0.0.0.0:8000
```

---

### Problem: CORS errors in console

**Symptoms:**
- Console shows "Access to XMLHttpRequest blocked by CORS policy"
- Development: Frontend on port 3000, Backend on 8000

**Diagnosis:**
```bash
# This is expected during development with separate ports
# Check CORS_ALLOWED_ORIGINS in settings.py

python manage.py shell
>>> from django.conf import settings
>>> print(settings.CORS_ALLOWED_ORIGINS)
```

**Fix:**
```python
# In settings.py, ensure:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",  # Add this for development
]
```

---

### Problem: Database connection error

**Symptoms:**
- Django won't start
- Error: "Error loading MySQLdb module"
- Error: "No module named 'psycopg2'"

**Diagnosis:**
```bash
# Check which database is configured
python manage.py shell
>>> from django.conf import settings
>>> print(settings.DATABASES['default']['ENGINE'])
```

**Fix:**
```bash
# For SQLite (default, no installation needed)
# Just ensure db.sqlite3 exists

# For PostgreSQL
pip install psycopg2-binary

# For MySQL
pip install mysqlclient

# Update requirements.txt
pip freeze > requirements.txt

# Run migrations
python manage.py migrate
```

---

### Problem: Port 8000 already in use

**Symptoms:**
- Error: "Address already in use"
- Django won't start

**Diagnosis:**
```bash
# Windows: Find process on port 8000
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

**Fix:**
```bash
# Windows: Kill process by PID
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>

# Or use different port
python manage.py runserver 0.0.0.0:8001
```

---

### Problem: Static files permission denied

**Symptoms:**
- Error: "Permission denied" when collecting static files
- Error: "Cannot create directory"

**Fix:**
```bash
# Windows: Run as Administrator
# Or change folder permissions

# Linux/Mac
sudo chown -R $USER:$USER backend/staticfiles/
chmod -R 755 backend/staticfiles/
```

---

## Performance Optimization Checklist

After deployment, optimize performance:

- [ ] Enable Django debug toolbar for profiling
- [ ] Add caching for API responses
- [ ] Minify React assets (done by `npm run build`)
- [ ] Use CDN for static files (optional)
- [ ] Enable database query caching
- [ ] Set up Redis for sessions (optional)
- [ ] Use Gunicorn with multiple workers (production)
- [ ] Configure Nginx as reverse proxy (production)

---

## Security Checklist

Before production deployment:

- [ ] Set `DEBUG = False` in settings.py
- [ ] Generate secure `SECRET_KEY`
- [ ] Whitelist `ALLOWED_HOSTS`
- [ ] Enable HTTPS/SSL
- [ ] Set `SECURE_SSL_REDIRECT = True`
- [ ] Enable CSRF protection
- [ ] Set secure cookies:
  - [ ] `SESSION_COOKIE_SECURE = True`
  - [ ] `CSRF_COOKIE_SECURE = True`
  - [ ] `SESSION_COOKIE_HTTPONLY = True`
  - [ ] `CSRF_COOKIE_HTTPONLY = True`
- [ ] Enable security headers
- [ ] Keep dependencies updated
- [ ] Use strong database password
- [ ] Protect sensitive environment variables

---

## Deployment Automation

### Use Provided Scripts

**PowerShell (Windows):**
```bash
.\deploy.ps1
```

**Bash (Linux/Mac):**
```bash
bash deploy.sh
```

Both scripts automate:
1. Clean previous build
2. Install dependencies
3. Build React
4. Copy to Django
5. Collect static files
6. Show instructions

---

## Backup & Recovery

### Before Deployment

```bash
# Backup database
cp backend/db.sqlite3 backend/db.sqlite3.backup

# Backup settings
cp backend/unimitr/settings.py backend/unimitr/settings.py.backup
```

### If Something Goes Wrong

```bash
# Stop Django
Ctrl+C

# Restore database
cp backend/db.sqlite3.backup backend/db.sqlite3

# Restore settings
cp backend/unimitr/settings.py.backup backend/unimitr/settings.py

# Start fresh
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

---

## Production Readiness

### Before Going Live

- [ ] Test deployment process 3+ times
- [ ] Run full test suite
- [ ] Test all user flows (create, read, update, delete)
- [ ] Test edge cases (no data, large data, invalid input)
- [ ] Performance test with load tool
- [ ] Security audit
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Runbook/documentation updated

### Initial Launch Checklist

- [ ] Server is running on port 8000
- [ ] SSL/HTTPS is configured
- [ ] Database is backed up
- [ ] Admin can log in
- [ ] Users can sign up
- [ ] Users can create events
- [ ] Users can view events
- [ ] API responses are correct
- [ ] Frontend updates when backend changes
- [ ] Admin dashboard works

---

## Support & Help

### Common Commands

```bash
# Start Django
cd backend && python manage.py runserver 0.0.0.0:8000

# Create superuser
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Clear cache
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()

# Database shell
python manage.py dbshell

# Django shell
python manage.py shell
```

### Useful Files

- **Configuration**: [INTEGRATION_REFERENCE.md](INTEGRATION_REFERENCE.md)
- **Deployment Guide**: [DEPLOYMENT_INTEGRATION_GUIDE.md](DEPLOYMENT_INTEGRATION_GUIDE.md)
- **Production Setup**: [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Architecture**: [REQUEST_FLOW_DIAGRAMS.md](REQUEST_FLOW_DIAGRAMS.md)

---

## Sign-Off Checklist

When everything is working:

```
✅ Deployment successful
✅ All tests passing
✅ Frontend loads and works
✅ API endpoints return data
✅ Admin dashboard accessible
✅ Database populated (or ready for data)
✅ Performance acceptable
✅ Security hardened
✅ Backups configured
✅ Monitoring active
✅ Team trained on deployment process
✅ Documentation complete
```

---

**Ready for deployment! 🚀**

*For questions or issues, refer to the troubleshooting section above or check the supporting documentation files.*
