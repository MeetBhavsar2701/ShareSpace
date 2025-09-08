# ShareSpace 🏠

**Find Your Place. Discover Your People.**

---

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-59C3E3?style=for-the-badge&logo=xgboost&logoColor=white)

---

ShareSpace is an intelligent roommate matching platform that uses machine learning to connect compatible people with amazing living spaces. Whether you're looking for a place to live or someone to share your space with, ShareSpace makes the process simple, safe, and successful.

## ✨ Features

### 🎯 Smart Matching Algorithm
- **AI-Powered Compatibility**: Uses XGBoost machine learning model to analyze lifestyle preferences, habits, and compatibility factors
- **Personalized Recommendations**: Get matched with roommates based on cleanliness, sleep schedule, noise tolerance, social preferences, and more
- **Budget Compatibility**: Smart filtering ensures financial compatibility between seekers and listers

### 🏡 Comprehensive Listing System
- **Advanced Search Filters**: Filter by price, location, amenities, house rules, and lifestyle preferences
- **Interactive Maps**: Visual location picker with Leaflet integration for precise address selection
- **Image Management**: Cloudinary-powered image uploads for listings and user profiles
- **Real-time Updates**: Track roommate availability and listing status

### 💬 Real-time Communication
- **WebSocket Chat**: Instant messaging between users with real-time notifications
- **Conversation Management**: Organized chat history and message threading

### 👤 User Profiles & Preferences
- **Detailed Profiles**: Comprehensive user profiles with lifestyle preferences, occupation, and personality traits
- **MBTI Integration**: Personality type matching for better compatibility
- **Favorites System**: Save and manage favorite listings and potential roommates
- **Role-based Access**: Separate interfaces for Seekers and Listers

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication system

## 🛠️ Tech Stack

### Backend
- **Django 4.x** - Web framework
- **Django REST Framework** - API development
- **Django Channels** - WebSocket support for real-time chat
- **PostgreSQL/SQLite** - Database
- **XGBoost** - Machine learning model for roommate matching
- **Cloudinary** - Image storage and management
- **JWT** - Authentication tokens

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Leaflet** - Interactive maps
- **Radix UI** - Accessible component primitives

### Machine Learning
- **XGBoost** - Gradient boosting for compatibility scoring
- **Scikit-learn** - Data preprocessing and model evaluation
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ShareSpace.git
   cd ShareSpace/Backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt channels cloudinary django-cloudinary-storage whitenoise xgboost scikit-learn pandas numpy joblib
   ```

4. **Set up environment variables**
   Create a `.env` file in the Backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Train the ML model (optional)**
   ```bash
   python train_model.py
   ```

8. **Start the development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## 📱 Usage

### For Seekers
1. **Sign up** and complete your profile with lifestyle preferences
2. **Browse listings** using advanced filters
3. **Get personalized matches** based on compatibility scores
4. **Chat with potential roommates** through the integrated messaging system
5. **Save favorites** and manage your matches

### For Listers
1. **Create a listing** with detailed information about your space
2. **Set preferences** for ideal roommates
3. **Review compatibility scores** of potential matches
4. **Communicate with seekers** through the chat system
5. **Manage your listing** and track roommate applications

## 🤖 Machine Learning Model

The roommate matching system uses an XGBoost regressor trained on compatibility factors:

### Features Analyzed
- **Lifestyle Habits**: Cleanliness, noise tolerance, sleep schedule
- **Social Preferences**: Social level, guest frequency, smoking habits
- **Financial Compatibility**: Budget alignment and tolerance
- **Personal Attributes**: Gender preferences, work schedule, occupation
- **Personality**: MBTI type integration for deeper compatibility

### Model Performance
- **R² Score**: Measures prediction accuracy
- **Cross-validation**: Ensures model reliability
- **Feature Importance**: Identifies key compatibility factors

## 📁 Project Structure

```
ShareSpace/
├── Backend/
│   ├── chat/                 # WebSocket chat functionality
│   ├── listings/             # Property listing management
│   ├── users/                # User profiles and authentication
│   ├── sharespace_backend/   # Django project settings
│   ├── train_model.py        # ML model training script
│   └── manage.py
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-specific components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
│   └── public/               # Static assets
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh

### Users
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/matches/` - Get compatibility matches

### Listings
- `GET /api/listings/` - List all active listings
- `POST /api/listings/` - Create new listing
- `GET /api/listings/{id}/` - Get listing details
- `PUT /api/listings/{id}/` - Update listing

### Chat
- `GET /api/chat/conversations/` - Get user conversations
- `POST /api/chat/conversations/` - Start new conversation
- WebSocket: `/ws/chat/{conversation_id}/` - Real-time messaging

## 🧪 Testing

### Backend Testing
```bash
cd Backend
python manage.py test
```

### Frontend Testing
```bash
cd Frontend
npm run test
```

## 🙏 Acknowledgments

- Django and React communities for excellent documentation
- XGBoost team for the powerful ML library
- Cloudinary for image management services


**Made with ❤️ for better roommate matching**
