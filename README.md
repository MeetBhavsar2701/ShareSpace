```markdown
# ShareSpace

A modern, full-stack roommate and listings platform. This project features real-time chat, ML-powered roommate matching, and rich listings functionality.

**Tech Stack:**
* **Backend:** Django, Django REST Framework, Channels (for WebSockets)
* **Frontend:** React (with Vite), Tailwind CSS

---

## Key Features

* **Real-time Chat:** Instant messaging between users, built with WebSockets.
* **ML Roommate Matching:** A pre-trained machine learning pipeline suggests compatible roommates.
* **Listings Management:** Full CRUD (Create, Read, Update, Delete) functionality for property listings, complete with filtering and an interactive map.
* **User System:** Includes authentication, user profiles, a 'favorites' system, and notifications.

---

## Project Structure

This project is organized as a monorepo:

```

ShareSpace/
├── Backend/   \# Django API, Channels, and apps (users, listings, chat)
└── Frontend/  \# React (Vite) UI

````

---

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* Git

### Backend Setup (Django)

```bash
# Navigate to the Backend directory
cd Backend

# Create and activate a virtual environment
python -m venv venv
# On Windows PowerShell:
# venv\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install django djangorestframework daphne channels channels-redis django-cors-headers cloudinary scikit-learn pandas numpy

# Run database migrations
python manage.py migrate

# (Optional) Seed the database with sample listings
# python manage.py seed_listings

# Start the development server
python manage.py runserver
````

The API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup (Vite + React)

```bash
# Navigate to the Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be running at `http://localhost:5173/`.

-----

## Environment Variables

You will need to create `.env` files for both the backend and frontend.

**Backend (`Backend/.env`):**

```
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
REDIS_URL=redis://localhost:6379/0
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

**Frontend (`Frontend/.env.local`):**

```
VITE_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
VITE_WS_BASE_URL=ws://127.0.0.1:8000
```

-----

## Running WebSockets for Chat

The standard `runserver` command will run the ASGI application by default. For a setup that more closely resembles a production environment, you can use Daphne:

```bash
cd Backend
daphne -b 0.0.0.0 -p 8000 sharespace_backend.asgi:application
```

*Note: If you are using the Redis channel layer, make sure your Redis server is running and properly configured in your Django settings.*

-----

## Running Tests

To run the backend tests:

```bash
cd Backend
python manage.py test
```

Examples of tests can be found in `Backend/test_token.py` and `Backend/test_websocket.py`.

-----

## Useful Commands

Here are some common commands you might use during development:

**Backend:**

```bash
# Create new database migrations
python manage.py makemigrations

# Apply database migrations
python manage.py migrate

# Create a superuser for the Django admin panel
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

**Frontend:**

```bash
# Start the development server
npm run dev

# Create a production build
npm run build

# Preview the production build
npm run preview
```

```

---
---


