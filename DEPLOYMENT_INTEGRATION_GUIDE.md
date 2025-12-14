# UniMitr - Complete Deployment Integration Guide

This guide walks you through deploying your Django backend and React frontend as a single unified application on port 8000.

---

## 📋 Overview

- **Frontend**: React (TypeScript) + Vite
- **Backend**: Django REST Framework
- **Deployment**: Single Django server serves both API and React app
- **Port**: `8000` (single port for both)
- **Build Output**: React build → Django's static folder

---

## 🏗️ Architecture

```
http://localhost:8000/                  → React Frontend (index.html)
http://localhost:8000/admin/            → Django Admin Dashboard
http://localhost:8000/api/events/       → Django REST API
http://localhost:8000/login/            → React Router (handled by React)
http://localhost:8000/dashboard/        → React Router (handled by React)
http://localhost:8000/home/             → React Router (handled by React)
```

---

## 📁 Folder Structure After Deployment

```
Uniमित्र Mobile App Design/
├── backend/
│   ├── unimitr/
│   │   ├── settings.py          ✅ Updated with static files config
│   │   ├── urls.py              ✅ Configured to serve React fallback
│   │   ├── views.py             ✅ Contains serve_react_index view
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── apps/
│   │   ├── authapp/
│   │   ├── events/
│   │   ├── clubs/
│   │   ├── volunteering/
│   │   ├── internships/
│   │   └── workshops/
│   ├── staticfiles_build/
│   │   └── frontend/            ← React build goes here (npm run build → moved here)
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
├── src/                          ← React source code
│   ├── components/
│   ├── lib/
│   │   └── api.ts               ✅ Updated for /api relative path
│   └── main.tsx
├── build/                        ← React production build (temporary)
├── vite.config.ts               ✅ Configured to build to 'build/' folder
├── package.json
└── tsconfig.json
```

---

## 🚀 Step-by-Step Deployment Instructions

### **Step 1: Build the React Frontend**

From the **root directory** (`Uniमित्र Mobile App Design/`):

```bash
# Clean previous build
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue

# Install frontend dependencies (if not already done)
npm install

# Build React for production
npm run build
```

**Output**: Creates a `build/` folder containing `index.html` and optimized assets.

---

### **Step 2: Copy React Build to Django**

After the build is complete, copy the `build/` contents to Django's static folder:

```bash
# PowerShell (Windows)
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# Or using bash (Git Bash / WSL)
cp -r build/* backend/staticfiles_build/frontend/
```

**Output**: React files are now in `backend/staticfiles_build/frontend/`:
- `backend/staticfiles_build/frontend/index.html`
- `backend/staticfiles_build/frontend/assets/` (CSS, JS, etc.)

---

### **Step 3: Collect Django Static Files** (Optional but Recommended)

From the **backend directory**:

```bash
cd backend
python manage.py collectstatic --noinput
```

This copies all static files (including React build) to `STATIC_ROOT` for production serving.

---

### **Step 4: Run Django Server**

From the **backend directory**:

```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

Or for production:

```bash
cd backend
gunicorn unimitr.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

---

### **Step 5: Verify Deployment**

- **React App**: `http://localhost:8000/`
- **Django Admin**: `http://localhost:8000/admin/`
- **API Endpoints**: `http://localhost:8000/api/events/`, etc.

All frontend routes (like `/login`, `/dashboard`) should work without errors.

---

## 🔧 Configuration Details

### **Django Settings (Backend)**

Key settings in `backend/unimitr/settings.py`:

```python
# Path to React build files
REACT_BUILD_DIR = BASE_DIR / 'staticfiles_build' / 'frontend'

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [str(REACT_BUILD_DIR)],  # React build directory
        'APP_DIRS': True,
        ...
    },
]

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    REACT_BUILD_DIR,  # Include React build folder
]

# CORS Configuration (for same-server deployment)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
CORS_ALLOW_CREDENTIALS = True
```

---

### **Django URL Routing (Backend)**

In `backend/unimitr/urls.py`:

```python
urlpatterns = [
    path('', root),                                    # Root API info
    path('health/', lambda _r: JsonResponse({'ok': True})),  # Health check
    path('admin/', admin.site.urls),                  # Django admin
    path('api/auth/', include('apps.authapp.urls')),  # Auth API
    path('api/', include('apps.events.urls')),        # Other APIs
    path('api/', include('apps.clubs.urls')),
    path('api/', include('apps.volunteering.urls')),
    path('api/', include('apps.internships.urls')),
    path('api/', include('apps.workshops.urls')),
    
    # React fallback - MUST be LAST
    re_path(r'^(?!api|admin|static|media).*$', serve_react_index),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

**How it works**:
1. Routes like `/api/*`, `/admin/*`, `/static/*`, `/media/*` are handled by Django
2. All other routes (like `/login`, `/dashboard`, `/clubs`) are caught by the regex `r'^(?!api|admin|static|media).*$'`
3. These routes return `index.html` from React, allowing React Router to handle them

---

### **Django View (Backend)**

In `backend/unimitr/views.py`:

```python
def serve_react_index(request):
    """
    Fallback view to serve React's index.html for SPA routing.
    Used for any path that doesn't match API or admin endpoints.
    """
    index_path = settings.REACT_BUILD_DIR / 'index.html'
    
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return HttpResponse(content, content_type='text/html')
    
    return HttpResponse('React app not built. Run "npm run build" from the frontend directory.', status=404)
```

---

### **React API Configuration (Frontend)**

In `src/lib/api.ts`:

```typescript
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      return 'http://localhost:8000/api';
    } else {
      // Production: both frontend and backend on same port
      return '/api';
    }
  }
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});
```

**Why?**:
- **Development**: Frontend runs on port 3000, backend on 8000 → use absolute URL
- **Production**: Both on port 8000 → use relative `/api` path (avoids CORS issues)

---

## 🔄 Automatic Frontend Updates

When you add events, clubs, or other data in Django admin:

### **For Real-Time Updates:**

1. **Option A: Polling** (Simple)
   - Frontend fetches data every 5-30 seconds
   - Add to your component:
   ```typescript
   useEffect(() => {
     const interval = setInterval(() => {
       // Fetch fresh data
       fetchEvents();
     }, 10000); // 10 seconds
     
     return () => clearInterval(interval);
   }, []);
   ```

2. **Option B: WebSockets** (Advanced)
   - Install Django Channels for real-time updates
   - Frontend connects to WebSocket for live data

3. **Option C: Manual Refresh**
   - User presses "Refresh" button
   - Browser hard refresh (Ctrl+Shift+R)

---

## 📝 Scripted Deployment (One Command)

Create a file `deploy.bat` in the root directory:

```batch
@echo off
echo Building React frontend...
npm run build

echo Copying build to Django...
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

echo Collecting Django static files...
cd backend
python manage.py collectstatic --noinput

echo Starting Django server...
python manage.py runserver 0.0.0.0:8000
```

Then run:
```bash
./deploy.bat
```

---

## ✅ Checklist

- [ ] React API base URL updated to use `/api` in production
- [ ] `npm run build` creates `build/` folder
- [ ] Build contents copied to `backend/staticfiles_build/frontend/`
- [ ] Django settings.py has correct static files and template configuration
- [ ] Django urls.py has React fallback regex as LAST route
- [ ] Django views.py has `serve_react_index` function
- [ ] Django server runs on port 8000
- [ ] `/` loads React app
- [ ] `/admin/` loads Django admin
- [ ] `/api/events/` returns JSON data
- [ ] `/login`, `/dashboard`, etc. load React (not 404)

---

## 🆘 Troubleshooting

### **Problem: React not found (404)**
- **Solution**: Check that `backend/staticfiles_build/frontend/index.html` exists
- **Solution**: Run `npm run build` and copy files again

### **Problem: API calls return 404**
- **Solution**: Ensure API base URL is `/api` in production
- **Solution**: Check Django API routes are correctly configured

### **Problem: CSS/JS files not loading**
- **Solution**: Run `python manage.py collectstatic --noinput`
- **Solution**: Check `STATIC_URL` and `STATICFILES_DIRS` in settings.py

### **Problem: Can't access `/admin/`**
- **Solution**: Create superuser: `python manage.py createsuperuser`
- **Solution**: Ensure Django admin route is BEFORE React fallback route

### **Problem: Django can't find React files**
- **Solution**: Verify `REACT_BUILD_DIR` path is correct
- **Solution**: Ensure files are copied to correct folder before running server

---

## 📚 Next Steps

1. **Production Deployment**:
   - Use Gunicorn instead of Django dev server
   - Configure Nginx as reverse proxy
   - Use environment variables for secrets

2. **Real-Time Updates**:
   - Integrate Django Channels for WebSockets
   - Implement live notifications

3. **CI/CD Pipeline**:
   - Automate build and deployment
   - Use GitHub Actions or similar

4. **Database**:
   - Switch from SQLite to PostgreSQL
   - Set up proper backups

---

## 📞 Support

For issues:
1. Check logs: `python manage.py runserver --verbosity 3`
2. Check browser console for JavaScript errors
3. Verify file structure matches expected layout
4. Ensure React build was created (`npm run build`)

---

**Happy deploying! 🚀**
