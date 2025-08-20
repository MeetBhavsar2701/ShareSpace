import pandas as pd
import joblib
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q 
from listings.models import Listing
from listings.serializers import ListingSerializer
from .models import CustomUser
from .serializers import LoginSerializer, ProfileUpdateSerializer, UserSerializer

class PublicProfileView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
            'avatar_url': UserSerializer(user, context={'request': request}).data.get('avatar_url'),
            'user_city': user.city,
            'role': user.role,
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'avatar_url': UserSerializer(user, context={'request': request}).data.get('avatar_url'),
                'user_city': user.city,
                'role': user.role,
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return ProfileUpdateSerializer

    def get_object(self):
        return self.request.user
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

# --- FIX: Changed 'query' to 'q' to match frontend ---
class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            # Search by username or email, exclude the current user, and limit to 10 results
            return CustomUser.objects.filter(
                Q(username__icontains=query) | Q(email__icontains=query)
            ).exclude(id=self.request.user.id)[:10]
        return CustomUser.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
class MatchesView(APIView):
    permission_classes = [IsAuthenticated]
    
    try:
        model_path = settings.BASE_DIR / 'roommate_matcher_pipeline.pkl'
        pipeline = joblib.load(model_path)
    except FileNotFoundError:
        pipeline = None

    def get(self, request, *args, **kwargs):
        from listings.serializers import ListingSerializer

        if self.pipeline is None:
            return Response({"error": "ML model not found."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        seeker = request.user
        if seeker.role != 'Seeker':
            return Response({"error": "Only 'Seekers' can view matches."}, status=status.HTTP_403_FORBIDDEN)

        REQUIRED_COLS_ORDER = [
            'role_seeker', 'city_seeker', 'budget_seeker', 'cleanliness_seeker', 'noise_level_seeker',
            'sleep_schedule_seeker', 'smoking_seeker', 'social_level_seeker', 'has_pets_seeker',
            'gender_preference_seeker', 'work_schedule_seeker', 'occupation_seeker', 'mbti_type_seeker',
            'budget_lister', 'has_pets_lister', 'cleanliness_lister', 'noise_level_lister',
            'sleep_schedule_lister', 'smoking_lister', 'social_level_lister',
            'gender_preference_lister', 'work_schedule_lister', 'occupation_lister', 'mbti_type_lister'
        ]
        
        seeker_data = {col: getattr(seeker, col.replace('_seeker', ''), None) for col in REQUIRED_COLS_ORDER if col.endswith('_seeker')}

        listers = CustomUser.objects.filter(role='Lister', listing__is_active=True).exclude(id=seeker.id).distinct()
        if not listers.exists():
            return Response([], status=status.HTTP_200_OK)

        prediction_data = []
        for lister in listers:
            lister_data = {col: getattr(lister, col.replace('_lister', ''), None) for col in REQUIRED_COLS_ORDER if col.endswith('_lister')}
            combined_data = {**seeker_data, **lister_data}
            prediction_data.append(combined_data)

        df_to_predict = pd.DataFrame(prediction_data)

        for col in REQUIRED_COLS_ORDER:
            if col not in df_to_predict.columns:
                 df_to_predict[col] = 0

        df_to_predict = df_to_predict[REQUIRED_COLS_ORDER]

        try:
            df_to_predict.fillna(0, inplace=True) 
            scores = self.pipeline.predict(df_to_predict)
        except Exception as e:
            return Response({"error": f"Prediction error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        results = []
        for i, lister in enumerate(listers):
            score = round(scores[i] * 100)
            listing = lister.listing_set.filter(is_active=True).first()
            if score > 50 and listing:
                results.append({
                    'lister_id': lister.id,
                    'lister_username': lister.username,
                    'lister_avatar_url': UserSerializer(lister).data.get('avatar_url'),
                    'listing_id': listing.id,
                    'listing_title': listing.title,
                    'listing_image_url': ListingSerializer(listing).data.get('image_url'),
                    'city': listing.city,
                    'rent': listing.rent,
                    'compatibility_score': int(score)
                })

        sorted_results = sorted(results, key=lambda x: x['compatibility_score'], reverse=True)
        return Response(sorted_results[:20])
    
class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        listing_id = request.data.get('listing_id')
        if not listing_id:
            return Response({"error": "Listing ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)
            
        user = request.user
        if user.favorites.filter(id=listing.id).exists():
            user.favorites.remove(listing)
            return Response({"status": "removed"}, status=status.HTTP_200_OK)
        else:
            user.favorites.add(listing)
            return Response({"status": "added"}, status=status.HTTP_200_OK)

class FavoriteListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.favorites.all()