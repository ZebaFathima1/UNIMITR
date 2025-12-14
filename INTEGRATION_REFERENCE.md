# Django + React Integration - Complete Configuration Reference

This document contains all the necessary configuration files and detailed explanations for running Django and React on the same server.

---

## 1️⃣ Django Settings Configuration

**File**: `backend/unimitr/settings.py`

### Static Files & Templates Section:

```python
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Path to React build files
REACT_BUILD_DIR = BASE_DIR / 'staticfiles_build' / 'frontend'

# Template configuration to serve React
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [str(REACT_BUILD_DIR)],  # React build directory
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

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Where Django collects all static files
STATICFILES_DIRS = [
    REACT_BUILD_DIR,  # Include React build folder
]

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# INSTALLED_APPS should include:
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',  # For CORS configuration
    'apps.authapp.apps.AuthappConfig',
    'apps.events.apps.EventsConfig',
    'apps.clubs.apps.ClubsConfig',
    'apps.volunteering.apps.VolunteeringConfig',
    'apps.internships.apps.InternshipsConfig',
    'apps.workshops.apps.WorkshopsConfig',
]

# MIDDLEWARE must include corsheaders.middleware.CorsMiddleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration - since frontend and backend are on same server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",  # For development with separate frontend server
]
CORS_ALLOW_CREDENTIALS = True

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    )
}

# JWT Configuration
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

---

## 2️⃣ Django URL Configuration

**File**: `backend/unimitr/urls.py`

```python
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from .views import serve_react_index

def root(_request):
    """
    Root API endpoint showing all available endpoints.
    """
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
            'register': '/api/events/{id}/register/',
            'registrations': '/api/events/{id}/registrations/',
        },
        'clubs': {
            'list': '/api/clubs/',
            'create': '/api/clubs/',
            'detail': '/api/clubs/{id}/',
            'join': '/api/clubs/{id}/join/',
            'requests': '/api/clubs/{id}/requests/',
        },
        'volunteering': {
            'list': '/api/volunteering/',
            'create': '/api/volunteering/',
            'detail': '/api/volunteering/{id}/',
            'apply': '/api/volunteering/{id}/apply/',
            'applications': '/api/volunteering/{id}/applications/',
        },
        'internships': {
            'list': '/api/internships/',
            'create': '/api/internships/',
            'detail': '/api/internships/{id}/',
            'apply': '/api/internships/{id}/apply/',
            'applications': '/api/internships/{id}/applications/',
        },
        'workshops': {
            'list': '/api/workshops/',
            'create': '/api/workshops/',
            'detail': '/api/workshops/{id}/',
            'register': '/api/workshops/{id}/register/',
            'registrations': '/api/workshops/{id}/registrations/',
        },
        'health': '/health/'
    })

# URL patterns - ORDER MATTERS!
# Django processes them top to bottom and uses the first match
urlpatterns = [
    # 1. Root endpoint
    path('', root),
    
    # 2. Health check
    path('health/', lambda _r: JsonResponse({'ok': True})),
    
    # 3. Django admin panel
    path('admin/', admin.site.urls),
    
    # 4. API endpoints (all prefixed with /api/)
    path('api/auth/', include('apps.authapp.urls')),
    path('api/', include('apps.events.urls')),
    path('api/', include('apps.clubs.urls')),
    path('api/', include('apps.volunteering.urls')),
    path('api/', include('apps.internships.urls')),
    path('api/', include('apps.workshops.urls')),
    
    # 5. CATCH-ALL: React frontend routes
    # This MUST be LAST!
    # Regex explanation: (?!api|admin|static|media).*
    # = Match anything NOT starting with: api, admin, static, or media
    re_path(r'^(?!api|admin|static|media).*$', serve_react_index),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### URL Pattern Priority:

```
Priority 1: path('', root)                          → http://localhost:8000/
Priority 2: path('health/', ...)                    → http://localhost:8000/health/
Priority 3: path('admin/', ...)                     → http://localhost:8000/admin/
Priority 4: path('api/auth/', include(...))         → http://localhost:8000/api/auth/*
Priority 5: path('api/', include(...))              → http://localhost:8000/api/*
Priority 6: re_path(r'^(?!api|admin|...).*$', ...) → Everything else → React

Examples of how routes are handled:
- /                          → root() → JSON API info
- /admin/                    → Django admin
- /api/events/               → Django REST API
- /api/events/1/             → Django REST API
- /login                     → serve_react_index() → React handles it
- /dashboard                 → serve_react_index() → React handles it
- /clubs/5                   → serve_react_index() → React handles it
- /static/style.css          → Django serves from STATICFILES_DIRS
- /media/uploads/img.jpg     → Django serves from MEDIA_ROOT
```

---

## 3️⃣ Django View to Serve React

**File**: `backend/unimitr/views.py`

```python
from django.views.generic import TemplateView
from django.conf import settings
from django.http import HttpResponse
from pathlib import Path
import os


class ReactView(TemplateView):
    """
    Generic view for serving React as a template.
    Alternative to serve_react_index function below.
    """
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


def serve_react_index(request):
    """
    Fallback view to serve React's index.html for SPA routing.
    
    When a user visits any route that's not /api/, /admin/, /static/, or /media/,
    this view returns the React index.html file. React Router then handles
    the client-side routing.
    
    This is called a "SPA catch-all" or "history API fallback".
    
    Args:
        request: The HTTP request object
        
    Returns:
        HttpResponse with index.html content and text/html content type
        
    Raises:
        404 if index.html doesn't exist (React build not run)
    """
    index_path = settings.REACT_BUILD_DIR / 'index.html'
    
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return HttpResponse(content, content_type='text/html')
    
    # Return error if React hasn't been built
    return HttpResponse(
        'React app not built. Run "npm run build" from the frontend directory.',
        status=404
    )
```

---

## 4️⃣ React API Configuration

**File**: `src/lib/api.ts`

```typescript
import axios from 'axios';

/**
 * Determine the API base URL based on environment
 * 
 * Development: 'http://localhost:8000/api'
 *   - Frontend runs on port 3000 (via npm run dev)
 *   - Backend runs on port 8000
 *   - Need absolute URL to connect across ports
 * 
 * Production: '/api'
 *   - Frontend and backend both on port 8000
 *   - Use relative URL to avoid CORS issues
 *   - All requests go to same origin
 */
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      // Development: separate ports
      return 'http://localhost:8000/api';
    } else {
      // Production: same port, same origin
      return '/api';
    }
  }
  return '/api';
};

// Create axios instance with configured base URL
const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Add cache-busting and no-cache headers to all requests
api.interceptors.request.use((config) => {
  // Add cache-busting timestamp to all GET requests
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params.t = Date.now();
    config.headers['Cache-Control'] = 'no-store, no-cache';
  }
  return config;
});

// Export for use in components
export default api;

// Usage in components:
// import api from '@/lib/api';
// const response = await api.get('/events/');
// const data = response.data;
```

---

## 5️⃣ Vite Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Path aliases for imports
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ... other aliases
    },
  },
  
  // Build configuration
  build: {
    target: 'esnext',
    outDir: 'build',  // Output directory: creates ./build/ folder
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    // Proxy API requests to Django in development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
});
```

---

## 6️⃣ Folder Structure After Integration

```
Uniमित्र Mobile App Design/
│
├── backend/                                      ← Django backend
│   ├── unimitr/
│   │   ├── __init__.py
│   │   ├── settings.py                          ✅ Static files + templates config
│   │   ├── urls.py                              ✅ URL routing with React fallback
│   │   ├── views.py                             ✅ serve_react_index() function
│   │   ├── wsgi.py                              ✅ For production servers
│   │   ├── asgi.py
│   │   └── __pycache__/
│   │
│   ├── apps/
│   │   ├── authapp/
│   │   ├── events/
│   │   ├── clubs/
│   │   ├── volunteering/
│   │   ├── internships/
│   │   └── workshops/
│   │
│   ├── staticfiles_build/
│   │   └── frontend/                            ← React build output (PRODUCTION)
│   │       ├── index.html                       ✅ React app entry point
│   │       ├── assets/
│   │       │   ├── index-xxxxx.js               ✅ Minified JavaScript
│   │       │   └── index-xxxxx.css              ✅ Minified CSS
│   │       └── manifest.json
│   │
│   ├── staticfiles/                             ← Collected static files (post deploy)
│   ├── media/                                   ← User uploads
│   │
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
│
├── src/                                          ← React source code
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── EventsPage.tsx
│   │   ├── ClubsPage.tsx
│   │   └── ... (other components)
│   │
│   ├── lib/
│   │   └── api.ts                               ✅ API configuration
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css
│
├── build/                                        ← Temporary build output
│   ├── index.html
│   ├── assets/
│   └── manifest.json
│
├── public/                                       ← Static assets
├── vite.config.ts                               ✅ Build configuration
├── package.json                                 ✅ npm scripts
├── tsconfig.json
│
├── deploy.ps1                                   ✅ Deployment script (PowerShell)
├── deploy.sh                                    ✅ Deployment script (Bash)
└── DEPLOYMENT_INTEGRATION_GUIDE.md              ✅ This guide
```

---

## 7️⃣ How the Integration Works

### Development Flow (Two Separate Servers):

```
User Browser
    ↓
http://localhost:3000 (React Dev Server - npm run dev)
    ↓ (HTTP request to API)
http://localhost:8000/api/events/ (Django Backend)
```

**Result**: Frontend and Backend on different ports
- Frontend runs on port 3000 with hot reload
- Backend runs on port 8000 with API endpoints

### Production Flow (Single Server):

```
User Browser
    ↓
http://localhost:8000 (Django Server)
    ├→ /                    → index.html (React served by Django)
    ├→ /admin/              → Django Admin
    ├→ /api/events/         → Django REST API
    └→ /login, /dashboard   → index.html → React Router handles routing
```

**Result**: Single port 8000, single Django process
- React files (index.html, JS, CSS) stored in `backend/staticfiles_build/frontend/`
- Django serves React for all non-API routes
- API calls use relative path `/api` (same origin, no CORS issues)

---

## 8️⃣ Real-Time Frontend Updates

When you add events/clubs in Django admin, here are ways to update the frontend:

### **Option 1: Auto-Refresh (Polling)**
```typescript
// In your component
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }, 10000); // Fetch every 10 seconds
  
  return () => clearInterval(interval);
}, []);
```

### **Option 2: Manual Refresh Button**
```typescript
<button onClick={() => window.location.reload()}>
  Refresh Data
</button>
```

### **Option 3: WebSocket (Real-Time)**
Requires Django Channels - advanced setup for live updates without polling.

---

## 9️⃣ npm Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "dev": "vite",                     // Dev server on port 3000
    "build": "tsc && vite build",      // Build for production to build/
    "preview": "vite preview",         // Preview production build locally
    "lint": "eslint . --ext ts,tsx"    // Check code style
  }
}
```

---

## 🔟 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| React returns 404 | Build not in correct folder | Run `npm run build` and copy to `backend/staticfiles_build/frontend/` |
| CSS/JS files not loading | Static files not collected | Run `python manage.py collectstatic --noinput` |
| API returns 404 | Base URL incorrect | Check `api.ts` - should be `/api` in production |
| Can't access `/admin/` | Admin route after React fallback | Ensure `path('admin/', ...)` comes BEFORE `re_path(...)` |
| Django can't find `index.html` | Wrong path in settings | Check `REACT_BUILD_DIR` points to `backend/staticfiles_build/frontend/` |
| Styles not applied | CSS not minified/loaded | Ensure `npm run build` was run and files copied |

---

## 🔗 Complete Deployment Command Sequence

```bash
# 1. Navigate to root directory
cd "Uniमित्र Mobile App Design"

# 2. Build React
npm install
npm run build

# 3. Copy React build to Django
# On Windows PowerShell:
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# On Linux/Mac:
cp -r build/* backend/staticfiles_build/frontend/

# 4. Go to backend directory
cd backend

# 5. Collect static files (optional but recommended)
python manage.py collectstatic --noinput

# 6. Run Django server
python manage.py runserver 0.0.0.0:8000

# 7. Visit in browser
# http://localhost:8000
```

---

**Last Updated**: 2025-12-12  
**Status**: Complete and Production Ready ✅
