from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
import pandas as pd
import joblib
from django.conf import settings

from .models import Listing
from users.models import CustomUser
from .serializers import ListingSerializer

class PersonalizedListingListView(APIView):
    """
    This view provides a personalized list of listings.
    For authenticated 'Seeker' users, it calculates and adds a compatibility score.
    It also supports filtering by search query and other criteria.
    """
    permission_classes = [AllowAny]
    
    try:
        model_path = settings.BASE_DIR / 'roommate_matcher_pipeline.pkl'
        pipeline = joblib.load(model_path)
    except FileNotFoundError:
        pipeline = None

    def get(self, request, *args, **kwargs):
        user = request.user
        queryset = Listing.objects.filter(is_active=True).select_related('lister').order_by('-created_at')
        
        # --- Filtering Logic ---
        search_query = request.query_params.get('search', None)
        pets_allowed = request.query_params.get('pets_allowed', None)
        smoking_allowed = request.query_params.get('smoking_allowed', None)
        min_rent = request.query_params.get('min_rent', None)
        max_rent = request.query_params.get('max_rent', None)

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(address__icontains=search_query)
            )
        if pets_allowed is not None:
            queryset = queryset.filter(pets_allowed=pets_allowed.lower() == 'true')
        if smoking_allowed is not None:
            queryset = queryset.filter(smoking_allowed=smoking_allowed.lower() == 'true')
        if min_rent:
            queryset = queryset.filter(rent__gte=min_rent)
        if max_rent:
            queryset = queryset.filter(rent__lte=max_rent)

        # --- Compatibility Scoring for Seekers ---
        if user.is_authenticated and user.role == 'Seeker' and self.pipeline:
            listers_with_listings = CustomUser.objects.filter(id__in=queryset.values_list('lister_id', flat=True)).distinct()
            
            if listers_with_listings.exists():
                # Prepare data for ML model prediction
                prediction_data = []
                REQUIRED_COLS = [
                    'role', 'city', 'budget', 'cleanliness', 'noise_level', 'sleep_schedule', 
                    'smoking', 'social_level', 'has_pets', 'gender_preference', 
                    'work_schedule', 'occupation', 'mbti_type'
                ]
                
                for lister in listers_with_listings:
                    data_row = {f"{col}_seeker": getattr(user, col, None) for col in REQUIRED_COLS}
                    data_row.update({f"{col}_lister": getattr(lister, col, None) for col in REQUIRED_COLS if col not in ['role', 'city']})
                    prediction_data.append(data_row)
                
                df_to_predict = pd.DataFrame(prediction_data)
                df_to_predict.fillna(0, inplace=True)
                
                try:
                    scores = self.pipeline.predict(df_to_predict)
                    lister_scores = {lister.id: score for lister, score in zip(listers_with_listings, scores)}
                    
                    # Attach scores to each listing object
                    for listing in queryset:
                        score = lister_scores.get(listing.lister.id, 0)
                        listing.compatibility_score = min(99, int(round(score * 100))) # Convert to percentage
                    
                    # Sort by the new compatibility_score attribute
                    queryset = sorted(queryset, key=lambda x: getattr(x, 'compatibility_score', 0), reverse=True)

                except Exception as e:
                    # If prediction fails, just return the normally sorted list
                    print(f"Prediction error: {e}")
        
        serializer = ListingSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class ListingListView(generics.ListAPIView):
    """ A view for all listings without personalization (fallback). """
    queryset = Listing.objects.filter(is_active=True).order_by('-created_at')
    permission_classes = [AllowAny]
    serializer_class = ListingSerializer

class ListingDetailView(generics.RetrieveAPIView):
    """ A view for a single listing's details. """
    queryset = Listing.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'
    serializer_class = ListingSerializer

class ListingCreateView(generics.CreateAPIView):
    """ Endpoint for creating a new listing. """
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def perform_create(self, serializer):
        if self.request.user.role != 'Lister':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only users with the 'Lister' role can create listings.")
        serializer.save(lister=self.request.user)

class MyListingsView(generics.ListAPIView):
    """ Endpoint for a 'Lister' to see their own listings. """
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def get_queryset(self):
        return Listing.objects.filter(lister=self.request.user).order_by('-created_at')

class ListingUpdateView(generics.UpdateAPIView):
    """ Endpoint for updating a listing. """
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    serializer_class = ListingSerializer

    def get_queryset(self):
        # Ensure users can only update their own listings
        return self.queryset.filter(lister=self.request.user)

class ListingDeleteView(generics.DestroyAPIView):
    """ Endpoint for deleting a listing. """
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    serializer_class = ListingSerializer

    def get_queryset(self):
        # Ensure users can only delete their own listings
        return self.queryset.filter(lister=self.request.user)