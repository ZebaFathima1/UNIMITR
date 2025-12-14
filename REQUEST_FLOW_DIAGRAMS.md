# 🔄 Request Flow Diagrams & Architecture

## Request Flow Diagram

### Development Mode (Two Servers)

```
┌─────────────────────────────────────────────────────────────┐
│                       User Browser                          │
└────────────────┬────────────────────────────┬───────────────┘
                 │                            │
        Port 3000│                    Port 8000│
                 │                            │
        ┌────────▼────────┐         ┌────────▼────────┐
        │  React App      │         │  Django Server  │
        │  (npm run dev)  │         │  (Flask/API)    │
        │  - index.html   │         │  - Events API   │
        │  - JS/CSS       │         │  - Clubs API    │
        │  - Hot Reload   │         │  - Admin Panel  │
        └─────────────────┘         └─────────────────┘
                 ▲                            ▲
                 │                            │
                 └────────────────────────────┘
                   CORS Required
                   (Different origins)
```

### Production Mode (Single Server)

```
┌─────────────────────────────────────────────────────────────┐
│                       User Browser                          │
│                                                              │
│              http://localhost:8000                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Port 8000
                         ▼
        ┌────────────────────────────────┐
        │      Django Server             │
        │     (Gunicorn WSGI)            │
        │                                │
        │  URL Pattern Matching:         │
        │  ├─ /api/*              ──┐    │
        │  │  → REST API           │    │
        │  │                        │    │
        │  ├─ /admin/*        ──┐  │    │
        │  │  → Django Admin  │  │  │    │
        │  │                  │  │  │    │
        │  ├─ /static/*       │  │  │    │
        │  │  → CSS/JS files  │  │  │    │
        │  │                  │  │  │    │
        │  ├─ /media/*        │  │  │    │
        │  │  → User uploads  │  │  │    │
        │  │                  │  │  │    │
        │  └─ /* (catch-all)──┘  │  │    │
        │     → index.html       │  │    │
        │     → React Router     │  │    │
        │                        │  │    │
        │  Response:            │  │    │
        │  ├─ HTML/JS/CSS       │  │    │
        │  ├─ JSON Data         │  │    │
        │  └─ Media Files       │  │    │
        │                                │
        │  Static Files:                 │
        │  /staticfiles/                 │
        │  ├─ React build (frontend)    │
        │  ├─ CSS                        │
        │  └─ JS                         │
        └────────────────────────────────┘
```

---

## Request Routing Decision Tree

```
                    Incoming Request
                           │
                           ▼
                 ┌──────────────────┐
                 │   Check URL      │
                 │   Path           │
                 └────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
         /api/*?     /admin/*?    /static/*?
              │           │           │
         YES │           │           │ YES
              ▼           ▼           ▼
        ┌─────────┐  ┌────────┐  ┌──────────┐
        │ Django  │  │Django  │  │ Static   │
        │ REST    │  │ Admin  │  │ Files    │
        │ API     │  │ Panel  │  │ (CSS/JS) │
        │ (JSON)  │  │(HTML)  │  │          │
        └─────────┘  └────────┘  └──────────┘
              │           │           │
              └───────────┼───────────┘
                          │
                          │ NO match
                          ▼
                ┌──────────────────────┐
                │  Serve React's       │
                │  index.html          │
                │  (SPA Fallback)      │
                └──────────┬───────────┘
                           │
                           ▼
                    Browser loads
                    React App
                           │
                           ▼
                    React Router
                    handles route
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
            Shows                 Fetches
            Component             API Data
                │                     │
                └──────────┬──────────┘
                           │
                           ▼
                    Render Page
```

---

## File Serving Architecture

```
Django Request Handler
│
├─ /api/events/
│  └─→ REST API Response (JSON)
│      {
│        "id": 1,
│        "title": "Event Name",
│        "date": "2025-12-15"
│      }
│
├─ /admin/
│  └─→ Django Admin Template (HTML)
│      [Django Admin Dashboard]
│
├─ /static/assets/index.js
│  └─→ Serve from STATICFILES_DIRS
│      backend/staticfiles_build/frontend/assets/index-xxxx.js
│
├─ /media/event/banner.jpg
│  └─→ Serve from MEDIA_ROOT
│      backend/media/event/banner.jpg
│
├─ /login
│  └─→ Catch-all: Serve React index.html
│      <!DOCTYPE html>
│      <html>
│        <script src="/static/assets/index.js"></script>
│      </html>
│
└─ /dashboard
   └─→ Catch-all: Serve React index.html
       React Router loads Dashboard component
```

---

## Component Communication Flow

```
┌──────────────────────────────────────────────────────────┐
│                   React Component                        │
│                  (EventsPage.tsx)                        │
└─────────────────────┬──────────────────────────────────┘
                      │
                      │ useEffect(() => {
                      │   api.get('/events/')
                      │ })
                      │
                      ▼
         ┌────────────────────────────┐
         │  Axios Instance            │
         │  (src/lib/api.ts)          │
         │                            │
         │  baseURL: '/api'           │
         └────────────┬───────────────┘
                      │
                      │ GET /api/events/
                      │
                      ▼
         ┌────────────────────────────┐
         │  Django Server             │
         │  unimitr.wsgi              │
         │  port 8000                 │
         └────────────┬───────────────┘
                      │
                      │ URL: /api/events/
                      │ Matches: path('api/', include(...))
                      │
                      ▼
         ┌────────────────────────────┐
         │  apps.events.urls          │
         │  apps.events.views         │
         │  apps.events.serializers   │
         └────────────┬───────────────┘
                      │
                      │ Query Database
                      │ Serialize to JSON
                      │
                      ▼
         ┌────────────────────────────┐
         │  Response                  │
         │  Content-Type: JSON        │
         │  Status: 200               │
         │  Body: [{event data...}]   │
         └────────────┬───────────────┘
                      │
                      │ HTTP Response
                      │
                      ▼
         ┌────────────────────────────┐
         │  Axios Response Handler    │
         │  response.data = [...]     │
         └────────────┬───────────────┘
                      │
                      │ setState(response.data)
                      │
                      ▼
         ┌────────────────────────────┐
         │  React Component           │
         │  Renders Events List       │
         │  Displays in UI            │
         └────────────────────────────┘
```

---

## Build & Deployment Flow

```
Development Code
├─ src/components/*.tsx
├─ src/lib/api.ts
└─ vite.config.ts
        │
        │ npm install
        ▼
Installed Dependencies
├─ node_modules/
├─ React
├─ TypeScript
└─ Vite
        │
        │ npm run build
        ▼
Optimized Build
├─ build/
├─ index.html (minified)
├─ assets/
│  ├─ index-abc123.js (minified)
│  └─ index-def456.css (minified)
└─ manifest.json
        │
        │ Copy build/* → Django
        ▼
Django Static Files
├─ backend/staticfiles_build/frontend/
├─ index.html
├─ assets/
│  ├─ index-abc123.js
│  └─ index-def456.css
└─ manifest.json
        │
        │ python manage.py collectstatic
        ▼
Collected Static Files
├─ backend/staticfiles/ (collected here)
├─ React files
├─ Django admin CSS
└─ Other static assets
        │
        │ python manage.py runserver
        ▼
Django Server Running
        │
        │ GET http://localhost:8000/
        ▼
Django Serves index.html
        │
        │ Browser loads React
        │ Downloads JS/CSS
        │ Renders React App
        ▼
Running Application
        │
        │ User interacts
        │ Clicks "Events"
        │ Component mounts
        │ Calls api.get('/events/')
        ▼
Django API Response
        │
        │ JSON data returned
        │ React re-renders
        │ User sees data
        ▼
Working Application ✅
```

---

## URL Resolution Order (Priority)

```
1. path('', root)
   │
   └─ Matches: http://localhost:8000/
      Returns: JSON with API endpoints
      Priority: FIRST (matches only /)

2. path('health/', ...)
   │
   └─ Matches: http://localhost:8000/health/
      Returns: {"ok": true}
      Priority: EARLY

3. path('admin/', admin.site.urls)
   │
   └─ Matches: http://localhost:8000/admin/*
      Returns: Django Admin Dashboard
      Priority: BEFORE catch-all

4. path('api/auth/', include(...))
   │
   └─ Matches: http://localhost:8000/api/auth/*
      Returns: Auth API responses
      Priority: BEFORE catch-all

5. path('api/', include(...))
   │
   └─ Matches: http://localhost:8000/api/*
      Returns: API responses
      Priority: BEFORE catch-all

6. re_path(r'^(?!api|admin|static|media).*$', serve_react_index)
   │
   └─ Matches: Everything else
      ├─ http://localhost:8000/login
      ├─ http://localhost:8000/dashboard
      ├─ http://localhost:8000/clubs/5
      └─ http://localhost:8000/any/path
      Returns: index.html (React app)
      React Router handles the routing
      Priority: LAST (catch-all)

NEGATIVE LOOKAHEAD EXPLANATION:
   (?!api|admin|static|media)
   = "Match anything NOT starting with: api, admin, static, or media"
   = "Exclude these prefixes"
   = "Catch everything else"

Examples:
   ✅ /login           → Matches (not api/admin/static/media)
   ✅ /dashboard       → Matches (not api/admin/static/media)
   ✅ /clubs           → Matches (not api/admin/static/media)
   ✅ /events          → Matches (not api/admin/static/media)
   ✅ /user/profile    → Matches (not api/admin/static/media)
   ✅ /                → Matches (but caught by path('', root) first)
   ✗ /api/events      → Does NOT match (excluded)
   ✗ /admin/          → Does NOT match (excluded)
   ✗ /static/style.css→ Does NOT match (excluded)
```

---

## CORS Flow (Development vs Production)

### Development (npm run dev + Django)

```
Browser (port 3000)
    │
    │ Request to different origin
    │ (port 8000)
    │
    ├─ Preflight: OPTIONS /api/events/
    │
    ▼ Django receives OPTIONS request
    │
    ├─ Check: CORS_ALLOWED_ORIGINS
    │ ├─ Contains "http://localhost:3000"? YES
    │
    ▼ Django responds with CORS headers
    │
    ├─ Response:
    │ │ Access-Control-Allow-Origin: http://localhost:3000
    │ │ Access-Control-Allow-Methods: GET, POST, PUT, DELETE
    │ │ Access-Control-Allow-Credentials: true
    │
    ▼ Browser receives CORS headers
    │
    ├─ Check: Safe to proceed? YES
    │
    ▼ Actual request: GET /api/events/
    │
    ▼ Django responds with data
```

### Production (Both on port 8000)

```
Browser (port 8000)
    │
    │ Request to same origin
    │ (port 8000)
    │
    ├─ No preflight needed
    │ (Same protocol + host + port)
    │
    ▼ Django receives GET /api/events/
    │
    ▼ Django responds with data
    │
    ├─ CORS headers NOT needed
    │ (Same origin)
```

---

## Static Files Serving

### Development

```
Django collectstatic (Not run)
    └─ Static files served directly from:
       ├─ STATICFILES_DIRS[0]: backend/staticfiles_build/frontend/
       │  └─ React build (index.html, assets/)
       │
       └─ Debug = True
          └─ Django development server handles static files
```

### Production

```
Django collectstatic --noinput
    ├─ Collects from STATICFILES_DIRS:
    │  └─ backend/staticfiles_build/frontend/
    │
    └─ Copies to STATIC_ROOT:
       └─ backend/staticfiles/
          ├─ React files (index.html, assets/)
          ├─ Django admin CSS/JS
          └─ Other static files

Nginx reverse proxy
    ├─ Serves /static/ directly from:
    │  └─ backend/staticfiles/
    │
    └─ Proxies non-static requests to:
       └─ Gunicorn (Django)
          ├─ http://127.0.0.1:8000
```

---

## Cache & Performance Flow

```
User visits http://localhost:8000/

    ▼

Browser sends:
GET / HTTP/1.1
Host: localhost:8000

    ▼

Django processes:
1. Check URL patterns
2. Matches catch-all regex
3. Calls serve_react_index()
4. Reads backend/staticfiles_build/frontend/index.html
5. Returns with Content-Type: text/html

    ▼

Browser receives:
HTTP/1.1 200 OK
Content-Type: text/html
...
<html>
  <head>...</head>
  <body>
    <script src="/static/assets/index-abc123.js"></script>
    <link rel="stylesheet" href="/static/assets/index-def456.css">
  </body>
</html>

    ▼

Browser parses HTML and loads:
1. /static/assets/index-abc123.js (via Nginx/Django)
2. /static/assets/index-def456.css (via Nginx/Django)

    ▼

React app initializes:
- Renders components
- Sets up state
- Ready for user interaction

    ▼

User interacts:
- Clicks "Events" button
- React Router loads EventsPage component
- Component mounts, useEffect runs
- Calls api.get('/events/')

    ▼

API request:
GET /api/events/ HTTP/1.1
Host: localhost:8000

    ▼

Django API processes:
1. Check URL patterns
2. Matches path('api/', include(...))
3. Routes to events.views
4. Queries database
5. Serializes to JSON
6. Returns JSON response

    ▼

React receives data:
- Updates state
- Re-renders component
- Shows list of events

    ▼

User sees results ✅
```

---

## Error Flow Example

```
User visits: http://localhost:8000/invalid-route

    ▼

Django URL matching:
1. path('', root) - NO match (/invalid-route != /)
2. path('health/', ...) - NO match
3. path('admin/', ...) - NO match
4. path('api/auth/', ...) - NO match
5. path('api/', ...) - NO match
6. re_path(r'^(?!api|admin|static|media).*$', ...) - MATCH! ✅

    ▼

serve_react_index() is called

    ▼

Check: settings.REACT_BUILD_DIR / 'index.html' exists?
├─ YES: Return index.html with status 200
└─ NO: Return error message with status 404

    ▼

Browser receives index.html

    ▼

React Router tries to match /invalid-route
├─ Found matching route? YES → Show component
└─ Found matching route? NO → Show 404 page (if defined)
```

---

**This is the complete request/response flow for the integrated system.** 🎯
