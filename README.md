## ShareSpace

An individual portfolio project showcasing a modern full‑stack web app: real‑time chat, ML‑powered roommate matching, and listings discovery. Built end‑to‑end by me using Django/DRF + Channels (ASGI) and React (Vite) + Tailwind CSS.

### Highlights — What this project demonstrates
- Backend API design with Django REST Framework and JWT‑style auth
- Real‑time features using WebSockets (Django Channels)
- Frontend stateful UI with React + modern tooling (Vite, Tailwind)
- Practical ML integration via a scikit‑learn pipeline for recommendations
- Clean project structure, environment management, and testing

> If you're reviewing my work: jump to Architecture, Technical Decisions, and Roadmap below.

### Features
- Real‑time chat (WebSockets)
- Roommate matching via pretrained ML pipeline
- Listings CRUD with filters and map
- Auth, profiles, favorites, notifications

### Demo (local)
- API: `http://127.0.0.1:8000/`
- Frontend: `http://localhost:5173/`

Screenshots/GIFs
- AddListing → detail page: [screenshots/AddListing.png]
- Chat in real time: [screenshots/Chat.gif]
- Matching results: [screenshots/Matches.png]

### Monorepo
```
ShareSpace/
  Backend/   # Django API, Channels, apps (users, listings, chat)
  Frontend/  # React (Vite) UI
```

---

## Architecture (high level)
- Client (React) consumes REST endpoints for CRUD and uses WebSockets for live chat.
- API (Django/DRF) exposes endpoints for auth, users, listings, chat metadata.
- Realtime (Channels/ASGI) handles WebSocket connections for chat and presence.
- ML (scikit‑learn) uses pretrained artifacts (`roommate_matcher_pipeline.pkl`) to rank potential roommates.
- Static/media (optional Cloudinary) for image hosting.

```
React (Vite) ── REST ──> DRF (Django)
          ╲            ╱
           ╲─ WebSocket ─> Channels (ASGI)

ML Artifacts (pkl) → used by Django views/services for matching
```

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

## Technical Decisions (brief)
- Authentication: DRF with token/JWT‑style flows; CORS configured for local dev.
- Realtime: Channels with ASGI; optional Redis for scalable channel layers.
- Data: SQLite for local simplicity; easily replaceable with Postgres.
- ML: Pretrained scikit‑learn pipeline loaded on demand for deterministic results.
- Frontend: Vite for fast DX; Tailwind for utility‑first styling; componentized features.

## Security & Quality
- CORS restricted to dev origin by default
- Secrets pulled from environment variables
- Minimal test coverage included for auth and WebSockets

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

## Roadmap
- Dockerize dev and prod environments
- Integrate Redis for production WebSockets
- Add Postgres and migrations for cloud deployment
- Expand unit/integration tests (pytest + frontend testing)
- Add CI (GitHub Actions) and CD targets

## Contributing
1. Create a feature branch
2. Commit with clear messages
3. Open a PR with context/screenshots

## License
MIT (add a `LICENSE` file if missing).

---

## About This Project
I built ShareSpace to demonstrate full‑stack skills across backend, frontend, realtime communication, and practical ML integration. If you have feedback or opportunities, feel free to reach out.

Contact
- Email: your.email@example.com
- LinkedIn: https://www.linkedin.com/in/your‑profile
- Portfolio: https://your‑portfolio.example


