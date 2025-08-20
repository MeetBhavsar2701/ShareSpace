from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Listing, CustomUser
import pandas as pd
import joblib
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .serializers import ListingSerializer
from django.db.models import Count

class PersonalizedListingListView(APIView):
    permission_classes = [AllowAny]
    
    try:
        model_path = settings.BASE_DIR / 'roommate_matcher_pipeline.pkl'
        pipeline = joblib.load(model_path)
    except FileNotFoundError:
        pipeline = None

    def get(self, request, *args, **kwargs):
        user = request.user
        queryset = Listing.objects.filter(is_active=True).select_related('lister').order_by('-created_at')
        
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

        show_filter = request.query_params.get('show', 'all')
        
        if user.is_authenticated and user.role == 'Seeker':
            if show_filter == 'my_city':
                queryset = queryset.filter(city__iexact=user.city)

            if self.pipeline is not None:
                listers_with_listings = CustomUser.objects.filter(id__in=queryset.values_list('lister_id', flat=True)).distinct()
                
                if listers_with_listings.exists():
                    prediction_data = []
                    for lister in listers_with_listings:
                        prediction_data.append({
                            **{f"{col}_seeker": getattr(user, col, None) for col in ['role', 'city', 'budget', 'cleanliness', 'noise_level', 'sleep_schedule', 'smoking', 'social_level', 'has_pets', 'gender_preference', 'work_schedule', 'occupation', 'mbti_type']},
                            **{f"{col}_lister": getattr(lister, col, None) for col in ['budget', 'has_pets', 'cleanliness', 'noise_level', 'sleep_schedule', 'smoking', 'social_level', 'gender_preference', 'work_schedule', 'occupation', 'mbti_type']}
                        })
                    
                    df_to_predict = pd.DataFrame(prediction_data)
                    df_to_predict.fillna(0, inplace=True)
                    
                    try:
                        scores = self.pipeline.predict(df_to_predict)
                        lister_scores = {lister.id: score for lister, score in zip(listers_with_listings, scores)}
                        
                        for listing in queryset:
                            score = lister_scores.get(listing.lister.id, 0)
                            listing.compatibility_score = min(99, int(round(score)))
                        
                        if show_filter == 'top_matches':
                            queryset = [l for l in queryset if l.compatibility_score >= 70]

                        queryset = sorted(queryset, key=lambda x: getattr(x, 'compatibility_score', 0), reverse=True)

                    except Exception as e:
                        pass
        
        serializer = ListingSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class ListingListView(generics.ListAPIView):
    queryset = Listing.objects.filter(is_active=True).order_by('-created_at')
    permission_classes = [AllowAny]
    serializer_class = ListingSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'
    serializer_class = ListingSerializer

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        print("--------------------")
        print(f"Listing Lister: {obj.lister}")
        print(f"Request User: {user}")
        print(f"User Authenticated: {user.is_authenticated}")
        if user.is_authenticated:
            print(f"Is user the lister? {obj.lister == user}")
        print("--------------------")
        if not user.is_authenticated or obj.lister != user:
            obj.views += 1
            obj.save(update_fields=['views'])

        return obj

    def get_serializer_context(self):
        return {'request': self.request}

class ListingCreateView(generics.CreateAPIView):
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def perform_create(self, serializer):
        serializer.save(lister=self.request.user)

class MyListingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def get_queryset(self):
        return Listing.objects.filter(lister=self.request.user).annotate(
            favorites_count=Count('favorited_by')
        ).order_by('-created_at')
    
    def get_serializer_context(self):
        return {'request': self.request}

class ListingUpdateView(generics.UpdateAPIView):
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    serializer_class = ListingSerializer

    def get_queryset(self):
        return self.queryset.filter(lister=self.request.user)

class ListingDeleteView(generics.DestroyAPIView):
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    serializer_class = ListingSerializer

    def get_queryset(self):
        return self.queryset.filter(lister=self.request.user)