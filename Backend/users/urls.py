from django.urls import path
from .views import RegisterView, LoginView, ProfileUpdateView # <-- Import the new view
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]