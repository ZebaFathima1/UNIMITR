# 🚀 Quick Start: Deploy in 5 Steps

## Step 1: Build React (1 minute)
```bash
cd Uniमित्र\ Mobile\ App\ Design
npm install
npm run build
```

## Step 2: Copy to Django (30 seconds)
```powershell
# Windows PowerShell
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force
```

```bash
# Linux/Mac
cp -r build/* backend/staticfiles_build/frontend/
```

## Step 3: Collect Static Files (30 seconds)
```bash
cd backend
python manage.py collectstatic --noinput
```

## Step 4: Run Django Server (10 seconds)
```bash
python manage.py runserver 0.0.0.0:8000
```

## Step 5: Open Browser
- **App**: http://localhost:8000
- **Admin**: http://localhost:8000/admin
- **API**: http://localhost:8000/api/events/

---

## ✅ Verify Everything Works

| URL | Should Show |
|-----|------------|
| http://localhost:8000/ | React app loads |
| http://localhost:8000/admin/ | Django admin login |
| http://localhost:8000/login | React login page (not 404) |
| http://localhost:8000/dashboard | React dashboard (not 404) |
| http://localhost:8000/api/events/ | JSON list of events |
| http://localhost:8000/static/assets/ | React JS/CSS files load |

---

## 📁 Key Files Modified

1. **`backend/unimitr/settings.py`** ✅
   - Added React build directory path
   - Configured static files
   - Added CORS settings

2. **`backend/unimitr/urls.py`** ✅
   - Added React fallback route (MUST be last)
   - All API routes preserved

3. **`backend/unimitr/views.py`** ✅
   - Added `serve_react_index()` function
   - Serves `index.html` for SPA routing

4. **`src/lib/api.ts`** ✅
   - Updated to use relative `/api` path in production
   - Absolute path `http://localhost:8000/api` in development

---

## 🔧 Important Notes

### ❗ URL Routing Order Matters
In `urls.py`, Django checks routes in order:
1. ✅ `/api/*` → Django API
2. ✅ `/admin/*` → Django Admin
3. ✅ `/static/*` → Static files
4. ✅ `/media/*` → Media files
5. ✅ Everything else → React (via `serve_react_index`)

**The React fallback MUST be LAST!**

### ❗ React Must Be Built First
- Development: `npm run dev` (port 3000, hot reload)
- Production: `npm run build` (creates optimized `build/` folder)

### ❗ Build Folder Must Be Copied
Don't leave the build in the root. Copy it to:
```
backend/staticfiles_build/frontend/
```

### ❗ CORS Configuration
Since frontend and backend are on the same port (8000), CORS is not needed in production. But `corsheaders` middleware is still included for backward compatibility.

---

## 🐛 Troubleshooting Quick Tips

**Problem**: React returns 404
```bash
# Solution: Check if index.html exists
ls backend/staticfiles_build/frontend/index.html
# If not, run: npm run build and copy files again
```

**Problem**: Styles/JS don't load
```bash
# Solution: Collect static files
cd backend
python manage.py collectstatic --noinput
```

**Problem**: API returns 404
```bash
# Solution: Check REACT_BUILD_DIR path in settings.py
# It should point to: backend/staticfiles_build/frontend/
```

**Problem**: Can't access `/admin/`
```bash
# Solution: Create superuser
cd backend
python manage.py createsuperuser
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           User Browser (Single Port: 8000)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Request: GET /              ────→  Django App Server        │
│  ↓                                        ↓                  │
│  Response: index.html                  ✓ Check URL patterns  │
│  (React App)                           ✓ Not /api or /admin  │
│                                        ✓ Serve React's       │
│                                          index.html          │
│                                                               │
│  Request: GET /api/events/   ────→  Django REST API         │
│  ↓                                        ↓                  │
│  Response: JSON data                   ✓ Return JSON         │
│                                                               │
│  Request: GET /admin/        ────→  Django Admin            │
│  ↓                                        ↓                  │
│  Response: Admin Dashboard             ✓ Return admin HTML   │
│                                                               │
│  Request: GET /dashboard     ────→  Django App Server        │
│  ↓                                        ↓                  │
│  Response: index.html                  ✓ Not API/admin       │
│  (React app handles routing)           ✓ Serve React        │
│                                          index.html          │
│  ↓                                                            │
│  React Router handles /dashboard                             │
│  Shows Dashboard Component                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Auto-Update Options

### When you add events in Django admin:

**Option 1**: Manual refresh
- User refreshes browser (Ctrl+R)

**Option 2**: Auto-refresh (add to components)
```typescript
useEffect(() => {
  const timer = setInterval(async () => {
    const response = await api.get('/events/');
    setEvents(response.data);
  }, 5000); // Check every 5 seconds
  return () => clearInterval(timer);
}, []);
```

**Option 3**: WebSocket (advanced)
- Install Django Channels
- Set up WebSocket connection
- Real-time push from server

---

## 🎯 Next Steps

1. ✅ **Deploy**: Follow 5-step guide above
2. ✅ **Test**: Verify all URLs work
3. ✅ **Customize**: Add events/clubs in admin
4. ✅ **Real-Time**: Implement auto-refresh if needed
5. ✅ **Production**: Use Gunicorn + Nginx instead of dev server

---

## 📞 Support Files

For detailed information, see:
- **`DEPLOYMENT_INTEGRATION_GUIDE.md`** - Complete guide with all details
- **`INTEGRATION_REFERENCE.md`** - Technical reference and configurations
- **`deploy.ps1`** - Automated deployment script (PowerShell)
- **`deploy.sh`** - Automated deployment script (Bash/Linux)

---

**Ready to deploy? Run the 5 steps above! 🚀**
