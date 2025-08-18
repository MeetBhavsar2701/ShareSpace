from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, LoginSerializer, ProfileUpdateSerializer
from .models import CustomUser

class RegisterView(generics.CreateAPIView):
    """
    An endpoint for new user registration.
    Now returns JWT tokens upon successful registration.
    """
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() # .save() calls the serializer's .create() method

        # --- GENERATE TOKENS FOR THE NEW USER ---
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
            'user_avatar': user.avatar.url if user.avatar else None,
            'user_city': user.city,
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """
    An endpoint for user login. Returns JWT tokens.
    """
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
                'user_avatar': user.avatar.url if user.avatar else None,
                'user_city': user.city,
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    An endpoint for the logged-in user to GET and UPDATE their own profile.
    """
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return ProfileUpdateSerializer

    def get_object(self):
        return self.request.user