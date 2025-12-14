# Uniमित्र - Fully Integrated Frontend & Backend Deployment

## ✅ Current Setup Status

Your application is now **fully integrated and merged** into a single Django server running on port **8000**.

### What's Included:
- ✅ React frontend (built and served from Django)
- ✅ Django REST API endpoints (`/api/*`)
- ✅ Django admin dashboard (`/admin/`)
- ✅ Static files (CSS, JS, images) from React build
- ✅ Fresh data fetching with 10-second auto-refresh polling
- ✅ Cache-busting for all API requests
- ✅ QR code scanner with camera + file upload
- ✅ Internship logo integration

---

## 📁 Project Folder Structure

```
Uniमित्र Mobile App Design/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── unimitr/
│   │   ├── settings.py          (Updated with REACT_BUILD_DIR)
│   │   ├── urls.py              (Serves React fallback)
│   │   └── views.py             (serve_react_index view)
│   ├── staticfiles_build/
│   │   └── frontend/            (React build output copied here)
│   │       ├── index.html
│   │       ├── assets/
│   │       │   ├── index-*.js
│   │       │   ├── index-*.css
│   │       │   └── images/
│   ├── apps/                    (Django apps: events, clubs, etc.)
│   └── requirements.txt
│
├── src/                         (React source code)
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   └── api.ts              (Updated with localhost:8000 base URL)
│   └── ...
│
├── build/                       (Latest React build output - safe to delete)
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 How to Run (Single Server)

### **IMPORTANT: Stop any running dev servers first**

```powershell
# Kill any existing node/npm processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Navigate to the project directory
$dir = Get-ChildItem "C:\Users\ZEBA FATHIMA\Downloads" -Filter "*Mobile App Design*" | Select-Object -First 1
Set-Location $dir.FullName
```

### **Run the unified server (ALL frontend + backend on port 8000)**

```powershell
cd backend
python manage.py runserver 8000
```

Then open your browser:
- **Frontend (React App):** http://localhost:8000/
- **Admin Dashboard:** http://localhost:8000/admin/
- **API Endpoints:** http://localhost:8000/api/*

---

## 🔄 If You Make Changes

### **Change to Frontend (React code in `/src`)**
1. Edit your React files
2. Rebuild and deploy:
   ```powershell
   cd ..                              # Go to project root
   npm run build
   Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force
   ```
3. Django will automatically serve the new build (file watcher enabled)

### **Change to Backend (Django code in `/backend/apps`)**
1. Edit your Django models, views, or serializers
2. Create and run migrations if needed:
   ```powershell
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```
3. Django will auto-reload (StatReloader enabled)

### **Change API Endpoint in Frontend**
The frontend already fetches from `http://localhost:8000/api/` with cache-busting. No changes needed!

---

## 🔐 Production Deployment (AWS/Azure/GCP/Traditional Server)

### **Step 1: Build the React app**
```powershell
npm run build
```

### **Step 2: Copy React build into Django**
```powershell
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force
```

### **Step 3: Update Django settings for production (`backend/unimitr/settings.py`)**
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')  # Use environment variables!

# Restrict CORS in production
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]
```

### **Step 4: Collect static files**
```bash
cd backend
python manage.py collectstatic --noinput
```

### **Step 5: Run migrations on production database**
```bash
python manage.py migrate --database=production
```

### **Step 6: Use a production WSGI server (Gunicorn)**
```bash
pip install gunicorn
gunicorn unimitr.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### **Step 7: Use a reverse proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/backend/media/;
    }
}
```

---

## 📊 Feature Checklist

- ✅ React app loads on `/` (all routes handled by React Router)
- ✅ Django admin accessible at `/admin/`
- ✅ API endpoints accessible at `/api/events/`, `/api/clubs/`, etc.
- ✅ React components fetch fresh data every 10 seconds
- ✅ Cache-busting on all API GET requests (timestamp parameter)
- ✅ Admin edits automatically reflected in frontend within 10 seconds
- ✅ QR code scanner with live camera support
- ✅ File upload for QR code images
- ✅ Internship logo on navbar
- ✅ Landing page with Uniमित्र logo

---

## 🧪 Testing

### **Test API endpoints**
```bash
curl http://localhost:8000/api/events/
curl http://localhost:8000/api/clubs/
curl http://localhost:8000/api/internships/
```

### **Test admin changes sync to frontend**
1. Open http://localhost:8000/ in one browser tab (frontend)
2. Open http://localhost:8000/admin/ in another tab
3. Create or edit an event/club in admin
4. Wait up to 10 seconds
5. Refresh the frontend tab — new data appears automatically

---

## 🛠️ Troubleshooting

### **Issue: "React build not found"**
Solution: Run `npm run build` and copy the output:
```powershell
npm run build
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force
```

### **Issue: API calls failing (404 or CORS errors)**
Solution: Ensure the frontend API client points to the correct URL:
- Check `src/lib/api.ts` has `baseURL: 'http://localhost:8000/api'`
- For production, update to your domain

### **Issue: Django static files not loading**
Solution: In production, run:
```bash
python manage.py collectstatic --noinput
```

### **Issue: Database migrations not applied**
Solution:
```bash
python manage.py migrate
```

---

## 📋 Commands Reference

| Task | Command |
|------|---------|
| **Build React** | `npm run build` |
| **Copy build to Django** | `Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force` |
| **Run migrations** | `cd backend && python manage.py migrate` |
| **Create admin user** | `python manage.py createsuperuser` |
| **Start server** | `cd backend && python manage.py runserver 8000` |
| **Collect static (prod)** | `python manage.py collectstatic --noinput` |
| **Run tests** | `python manage.py test` |

---

## 🎉 You're Done!

Your Uniमित्र app is now fully integrated and ready to deploy. Both frontend and backend run from a single Django server on **http://localhost:8000/**

**Next Steps:**
1. Customize as needed (colors, logos, additional features)
2. Test thoroughly with real data
3. Deploy to your production environment
4. Monitor admin→frontend data sync

For any issues or improvements, refer to this guide or check the README files in the project.

---

*Last updated: December 12, 2025*
