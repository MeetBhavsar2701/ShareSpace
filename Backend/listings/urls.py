from django.urls import path
from .views import ListingListView, ListingCreateView, ListingDetailView # Import the new view

urlpatterns = [
    path('', ListingListView.as_view(), name='listing-list'),
    path('create/', ListingCreateView.as_view(), name='listing-create'),
    path('<uuid:id>/', ListingDetailView.as_view(), name='listing-detail'),
]