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
    # path('', ListingListView.as_view(), name='listing-list'),
    path('', PersonalizedListingListView.as_view(), name='listing-list-personalized'), 
    path('create/', ListingCreateView.as_view(), name='listing-create'),
    path('my-listings/', MyListingsView.as_view(), name='my-listing-list'),
    path('<uuid:id>/', ListingDetailView.as_view(), name='listing-detail'),
    path('<uuid:id>/update/', ListingUpdateView.as_view(), name='listing-update'),
    path('<uuid:id>/delete/', ListingDeleteView.as_view(), name='listing-delete'),
]