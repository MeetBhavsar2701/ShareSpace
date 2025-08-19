from django.urls import path
from .views import (
    PersonalizedListingListView,
    ListingListView, 
    ListingCreateView, 
    ListingDetailView, 
    MyListingsView,
    ListingUpdateView,
    ListingDeleteView
)

urlpatterns = [
    # Main endpoint for browsing listings (with personalization)
    path('', PersonalizedListingListView.as_view(), name='listing-list-personalized'),
    
    # A fallback endpoint for all listings without personalization
    path('all/', ListingListView.as_view(), name='listing-list-all'),
    
    # Endpoint to create a new listing
    path('create/', ListingCreateView.as_view(), name='listing-create'),
    
    # Endpoint for a user to view their own listings
    path('my-listings/', MyListingsView.as_view(), name='my-listings'),
    
    # Endpoint for a single listing's details, update, and delete
    path('<uuid:id>/', ListingDetailView.as_view(), name='listing-detail'),
    path('<uuid:id>/update/', ListingUpdateView.as_view(), name='listing-update'),
    path('<uuid:id>/delete/', ListingDeleteView.as_view(), name='listing-delete'),
]