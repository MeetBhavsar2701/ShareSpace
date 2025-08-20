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
                queryset = queryset.prefetch_related('lister', 'current_roommates')

                prediction_data = []
                listing_member_map = []

                for listing in queryset:
                    # Filter out the current user from the list of roommates to be scored
                    members_to_score = [listing.lister] + list(listing.current_roommates.all())
                    members_to_score = [member for member in members_to_score if member.id != user.id]

                    for member in members_to_score:
                        prediction_data.append({
                            **{f"{col}_seeker": getattr(user, col, None) for col in ['role', 'city', 'budget', 'cleanliness', 'noise_level', 'sleep_schedule', 'smoking', 'social_level', 'has_pets', 'gender_preference', 'work_schedule', 'occupation', 'mbti_type']},
                            **{f"{col}_lister": getattr(member, col, None) for col in ['budget', 'has_pets', 'cleanliness', 'noise_level', 'sleep_schedule', 'smoking', 'social_level', 'gender_preference', 'work_schedule', 'occupation', 'mbti_type']}
                        })
                        listing_member_map.append(listing.id)

                if prediction_data:
                    df_to_predict = pd.DataFrame(prediction_data)
                    df_to_predict.fillna(0, inplace=True)

                    try:
                        scores = self.pipeline.predict(df_to_predict)
                        listing_scores = {}
                        for i, listing_id in enumerate(listing_member_map):
                            if listing_id not in listing_scores:
                                listing_scores[listing_id] = []
                            listing_scores[listing_id].append(scores[i])

                        for listing in queryset:
                            listing_id = listing.id
                            if listing_id in listing_scores and listing_scores[listing_id]:
                                avg_score = sum(listing_scores[listing_id]) / len(listing_scores[listing_id])
                                listing.compatibility_score = min(99, int(round(avg_score)))
                            else:
                                listing.compatibility_score = 0
                    except Exception as e:
                        for listing in queryset:
                            listing.compatibility_score = 0

            if show_filter == 'top_matches':
                queryset = [l for l in queryset if hasattr(l, 'compatibility_score') and l.compatibility_score >= 70]

            queryset = sorted(queryset, key=lambda x: getattr(x, 'compatibility_score', 0), reverse=True)


        serializer = ListingSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class ListingListView(generics.ListAPIView):
    queryset = Listing.objects.filter(is_active=True).order_by('-created_at')
    permission_classes = [AllowAny]
    serializer_class = ListingSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.all().prefetch_related('lister', 'current_roommates')
    permission_classes = [AllowAny]
    lookup_field = 'id'
    serializer_class = ListingSerializer

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        # Increment view count
        if not user.is_authenticated or obj.lister != user:
            obj.views += 1
            obj.save(update_fields=['views'])

        # Calculate compatibility scores if a seeker is viewing
        if user.is_authenticated and user.role == 'Seeker':
            try:
                model_path = settings.BASE_DIR / 'roommate_matcher_pipeline.pkl'
                pipeline = joblib.load(model_path)
            except FileNotFoundError:
                pipeline = None

            if pipeline:
                members_to_score = [obj.lister] + list(obj.current_roommates.all())
                prediction_data = []

                for member in members_to_score:
                    prediction_data.append({
                        **{f"{col}_seeker": getattr(user, col, None) for col in ['role', 'city', 'budget', 'cleanliness', 'noise_level', 'sleep_schedule', 'smoking', 'social_level', 'has_pets', 'gender_preference', 'work_schedule', 'occupation', 'mbti_type']},
                        **{f"{col}_lister": getattr(member, col, None) for col in ['budget', 'has_pets', 'cleanliness', 'noise_level', 'sleep_schedule', 'smoking', 'social_level', 'gender_preference', 'work_schedule', 'occupation', 'mbti_type']}
                    })

                if prediction_data:
                    df_to_predict = pd.DataFrame(prediction_data)
                    df_to_predict.fillna(0, inplace=True)
                    try:
                        scores = pipeline.predict(df_to_predict)
                        for member, score in zip(members_to_score, scores):
                            member.compatibility_score = min(99, int(round(score)))
                    except Exception as e:
                        # Handle prediction errors gracefully
                        pass
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