## ShareSpace

Modern full‑stack roommate and listings platform with real‑time chat, ML‑powered roommate matching, and rich listings. Backend: Django/DRF + Channels (ASGI). Frontend: React (Vite) + Tailwind CSS.

### Features
- Real‑time chat (WebSockets)
- Roommate matching via pretrained ML pipeline
- Listings CRUD with filters and map
- Auth, profiles, favorites, notifications

### Monorepo
```
ShareSpace/
  Backend/   # Django API, Channels, apps (users, listings, chat)
  Frontend/  # React (Vite) UI
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend (Django)
```bash
cd Backend
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1

pip install --upgrade pip
# If requirements.txt exists, prefer:
# pip install -r requirements.txt
# Otherwise, install common deps:
pip install django djangorestframework daphne channels channels-redis django-cors-headers cloudinary scikit-learn pandas numpy

python manage.py migrate
# Optional seed data
# python manage.py seed_listings

python manage.py runserver
```
API default: `http://127.0.0.1:8000/`.

### Frontend (Vite + React)
```bash
cd Frontend
npm install
npm run dev
```
App default: `http://localhost:5173/`.

---

## Environment Variables

Backend (`Backend/.env`):
```
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
REDIS_URL=redis://localhost:6379/0
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Frontend (`Frontend/.env.local`):
```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_BASE_URL=ws://127.0.0.1:8000
```

---

## WebSockets (Chat)
`runserver` runs ASGI by default. For production‑like dev:
```bash
cd Backend
daphne -b 0.0.0.0 -p 8000 sharespace_backend.asgi:application
```
If using Redis channel layer, ensure Redis is running and configured in settings.

---

## Tests
```bash
cd Backend
python manage.py test
```
See examples in `Backend/test_token.py` and `Backend/test_websocket.py`.

---

## Useful Commands
```bash
# Backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend
npm run dev
npm run build
npm run preview
```

---

## Contributing
1. Create a feature branch
2. Commit with clear messages
3. Open a PR with context/screenshots

## License
MIT (add a `LICENSE` file if missing).


