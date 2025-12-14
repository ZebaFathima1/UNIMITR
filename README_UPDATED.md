# 🎓 UniMitr - University Management Platform

A complete mobile-first web application for managing university clubs, events, workshops, internships, and volunteering opportunities.

**Live Demo:** [Coming Soon]  
**Original Design:** [Figma Link](https://www.figma.com/design/Dyp0IBprU4XdzbPh2dN29u/Uni%E0%A4%AE%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%B0-Mobile-App-Design)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- npm or yarn

### Deploy in 5 Steps

#### **Step 1: Build React**
```bash
npm install
npm run build
```

#### **Step 2: Copy to Django**
```powershell
# Windows PowerShell
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force

# Linux/Mac
cp -r build/* backend/staticfiles_build/frontend/
```

#### **Step 3: Collect Static Files**
```bash
cd backend
python manage.py collectstatic --noinput
```

#### **Step 4: Run Server**
```bash
python manage.py runserver 0.0.0.0:8000
```

#### **Step 5: Open Browser**
- **App:** http://localhost:8000
- **Admin:** http://localhost:8000/admin

**That's it! Both frontend and backend running on port 8000! 🎉**

---

## 📚 Documentation

Complete deployment documentation is provided:

| Document | Purpose | Time |
|----------|---------|------|
| [QUICK_START.md](QUICK_START.md) | 5-minute deployment | 5 min |
| [DEPLOYMENT_INTEGRATION_GUIDE.md](DEPLOYMENT_INTEGRATION_GUIDE.md) | Complete setup guide | 20 min |
| [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md) | Documentation index | 5 min |
| [INTEGRATION_REFERENCE.md](INTEGRATION_REFERENCE.md) | Technical reference | 30 min |
| [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) | Production setup | 30 min |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Verification & troubleshooting | 15 min |
| [REQUEST_FLOW_DIAGRAMS.md](REQUEST_FLOW_DIAGRAMS.md) | Architecture diagrams | 20 min |

**👉 Start with [QUICK_START.md](QUICK_START.md) or [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md)**

---

## 🏗️ Project Structure

```
Uniमित्र Mobile App Design/
├── backend/                          Django REST API
│   ├── unimitr/                     Main Django app
│   │   ├── settings.py              ✅ Static files configured
│   │   ├── urls.py                  ✅ React fallback routing
│   │   └── views.py                 ✅ Serve React index.html
│   │
│   ├── apps/                        API applications
│   │   ├── authapp/                 Authentication API
│   │   ├── events/                  Events management
│   │   ├── clubs/                   Clubs management
│   │   ├── volunteering/            Volunteering opportunities
│   │   ├── internships/             Internship listings
│   │   └── workshops/               Workshop management
│   │
│   ├── staticfiles_build/           Built React files
│   │   └── frontend/                React production build
│   │
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
│
├── src/                             React frontend (TypeScript)
│   ├── components/                  React components
│   ├── lib/api.ts                  ✅ API client configured
│   ├── App.tsx
│   └── main.tsx
│
├── public/                          Static assets
├── vite.config.ts                  ✅ Build configuration
├── package.json
├── tsconfig.json
│
├── deploy.ps1                      🔧 Windows deployment script
├── deploy.sh                       🔧 Linux deployment script
│
└── Documentation/                  Complete guides (see above)
```

---

## ✨ Features

### 👥 User Management
- User registration and authentication
- Profile creation and management
- JWT-based authentication
- Role-based access control (Student, Admin, Club Lead)

### 🎓 Events Management
- Browse university events
- Register for events
- Event approval workflow
- Event attendance tracking

### 🎨 Clubs Management
- Browse student clubs
- Join clubs with request approval
- Club member management
- Club-specific features

### 📚 Workshops
- Browse and register for workshops
- Workshop scheduling
- Attendance tracking
- Certificate generation

### 💼 Internships
- Browse internship opportunities
- Apply for internships
- Application tracking
- Shortlist management

### 🤝 Volunteering
- Browse volunteering opportunities
- Apply for volunteer roles
- Hours tracking
- Impact measurement

### 📱 Mobile-First Design
- Responsive design
- Bottom navigation for easy access
- Optimized for mobile devices
- Fast performance

### 🎮 Gamification
- Leaderboard system
- Points and achievements
- Badges
- Motivational notifications

---

## 🔧 Architecture

### Technology Stack

**Frontend:**
- React 18+ (with TypeScript)
- Vite (Fast build tool)
- Tailwind CSS (Styling)
- Radix UI (Component library)
- Axios (HTTP client)
- React Router (Navigation)

**Backend:**
- Django 5.0+ (Python web framework)
- Django REST Framework (API)
- Django CORS Headers (Cross-origin requests)
- SQLite (Development) / PostgreSQL (Production)
- JWT Authentication

**Deployment:**
- Gunicorn (Production WSGI server)
- Nginx (Reverse proxy)
- Docker (Containerization)

### URL Structure

```
http://localhost:8000/                    React App
http://localhost:8000/admin/              Django Admin
http://localhost:8000/api/events/         REST API
http://localhost:8000/api/clubs/          REST API
http://localhost:8000/api/internships/    REST API
http://localhost:8000/api/workshops/      REST API
http://localhost:8000/api/volunteering/   REST API
http://localhost:8000/api/auth/           Auth API
```

---

## 📖 Development

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Create virtual environment (first time)
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Linux/Mac

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server (port 8000)
python manage.py runserver

# Access admin panel
# http://localhost:8000/admin/
```

### API Documentation

See [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for complete API reference.

---

## 🚀 Deployment

### Development Deployment (Local Testing)

```bash
# Follow QUICK_START.md or deploy.ps1/deploy.sh
npm run build
Copy-Item -Path "build\*" -Destination "backend\staticfiles_build\frontend" -Recurse -Force
cd backend
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
```

### Production Deployment

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for:
- Gunicorn setup
- Nginx configuration
- SSL/HTTPS setup
- Database migration to PostgreSQL
- Environment variables
- Monitoring and logging

### Using Docker

```bash
# Build image
docker build -t unimitr:latest -f backend/Dockerfile backend/

# Run container
docker run -p 8000:8000 unimitr:latest

# See PRODUCTION_DEPLOYMENT.md for full Docker setup
```

---

## 🔑 Key Configurations

### Django Settings (backend/unimitr/settings.py)
- ✅ Static files configured to serve React build
- ✅ Templates configured to find React's index.html
- ✅ CORS enabled for API access
- ✅ JWT authentication configured
- ✅ Database configured (SQLite for dev, PostgreSQL for prod)

### Django URLs (backend/unimitr/urls.py)
- ✅ API routes prefixed with `/api/`
- ✅ Admin panel at `/admin/`
- ✅ React fallback route for all other paths
- ✅ Static files served in development

### React API Client (src/lib/api.ts)
- ✅ Automatic environment detection
- ✅ Absolute URL in development (port 3000 → 8000)
- ✅ Relative URL in production (same port)
- ✅ No CORS issues in production

---

## 📝 Real-Time Frontend Updates

When you add events or clubs in Django admin, the frontend updates through:

### Option 1: Manual Refresh (Simplest)
- User clicks "Refresh" button
- Browser refreshes page

### Option 2: Auto-Polling (Simple)
- Frontend fetches data every 10 seconds
- Users see updates automatically
- See [DEPLOYMENT_INTEGRATION_GUIDE.md](DEPLOYMENT_INTEGRATION_GUIDE.md) for code

### Option 3: WebSockets (Advanced)
- Install Django Channels for real-time updates
- Instant push updates to all connected clients
- Zero delay synchronization

---

## 🐛 Troubleshooting

### Common Issues

**React doesn't load (404)**
- Ensure `npm run build` was run
- Verify files copied to `backend/staticfiles_build/frontend/`
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#problem-react-doesnt-load-404)

**CSS/JS files not loading (404)**
- Run `python manage.py collectstatic --noinput`
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#problem-cssjs-files-not-loading-404)

**API returns 404**
- Check API base URL in `src/lib/api.ts`
- Verify Django API routes are configured
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#problem-api-returns-404)

**Can't access admin**
- Create superuser: `python manage.py createsuperuser`
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#problem-cant-access-django-admin)

For more issues, see [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#troubleshooting-guide)

---

## 📋 Database

### Development
- SQLite database (`backend/db.sqlite3`)
- No setup required
- Good for local testing

### Production
- PostgreSQL recommended
- See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md#database-setup-for-production)
- Set up automated backups

---

## 🔐 Security

### Development
- `DEBUG = True` (Django shows detailed errors)
- CORS enabled for cross-origin requests
- In-memory session storage

### Production
- Set `DEBUG = False`
- Generate secure `SECRET_KEY`
- Enable SSL/HTTPS
- Secure cookies
- Strong database password
- Environment variables for secrets

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#security-checklist) for full checklist.

---

## 📊 Performance

### Frontend Optimization
- Minified JS/CSS (`npm run build`)
- Code splitting via Vite
- Lazy loading of components
- Image optimization

### Backend Optimization
- Database query optimization
- Caching strategy
- CDN for static files
- Gunicorn multiple workers

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md#performance-optimization-checklist) for details.

---

## 📞 Support & Help

### Documentation
- [QUICK_START.md](QUICK_START.md) - 5-minute deployment
- [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md) - Documentation guide
- [DEPLOYMENT_INTEGRATION_GUIDE.md](DEPLOYMENT_INTEGRATION_GUIDE.md) - Complete guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Troubleshooting

### API Reference
- [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - REST API docs

### Repository
- **Frontend:** [src/](src/)
- **Backend:** [backend/](backend/)
- **Docs:** [Various .md files](.)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Acknowledgments

- Original Design: [Figma](https://www.figma.com/design/Dyp0IBprU4XdzbPh2dN29u/Uni%E0%A4%AE%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%B0-Mobile-App-Design)
- React & Vite community
- Django & DRF community

---

## 📅 Deployment Timeline

- **First Time Setup:** 30-45 minutes
- **Routine Deployments:** 2-5 minutes
- **Production Setup:** 1-2 hours
- **Full Automation:** Once per project

---

## ✅ Ready to Deploy?

1. **Quick Deploy:** Follow [QUICK_START.md](QUICK_START.md) (5 minutes)
2. **Understand First:** Read [DEPLOYMENT_INTEGRATION_GUIDE.md](DEPLOYMENT_INTEGRATION_GUIDE.md) (20 minutes)
3. **Production:** Follow [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) (30 minutes)

**Start with [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md) to choose your path!**

---

## 📊 Status

- ✅ Frontend: Complete & Working
- ✅ Backend: Complete & Working  
- ✅ Integration: Complete & Tested
- ✅ Documentation: Complete & Comprehensive
- ✅ Deployment: Ready for Production
- ✅ Real-Time Updates: Options provided

**Ready for production deployment! 🚀**

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0  
**Status:** Production Ready
