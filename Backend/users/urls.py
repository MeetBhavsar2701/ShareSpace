from django.urls import path
from .views import RegisterView, LoginView, ProfileUpdateView ,MatchesView,PublicProfileView, UserSearchView,ToggleFavoriteView,FavoriteListingsView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('matches/', MatchesView.as_view(), name='user-matches'),
    path('search/', UserSearchView.as_view(), name='user-search'),
     path('favorites/toggle/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
    path('favorites/', FavoriteListingsView.as_view(), name='favorite-listings'),
    path('<uuid:id>/', PublicProfileView.as_view(), name='public-profile-detail'),
]