from rest_framework import serializers
from .models import CustomUser

class LoginSerializer(serializers.Serializer):
    """
    Validates username and password for the login endpoint.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):
    """
    Handles new user registration and fetching user data.
    """
    # This field will dynamically create the full avatar URL.
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        # NOTE: 'budget' has been removed from initial signup.
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'avatar_url',
            'city', 'cleanliness', 'sleep_schedule', 'noise_level', 'guest_frequency', 
            'social_level', 'smoking', 'has_pets', 'gender_preference', 
            'work_schedule', 'occupation', 'mbti_type'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'avatar_url': {'read_only': True},
        }
        
    def get_avatar_url(self, obj):
        # Returns the full URL if an avatar exists, otherwise None.
        return obj.avatar.url if obj.avatar else None

    def create(self, validated_data):
        # Correctly creates a new user with a hashed password.
        user = CustomUser.objects.create_user(**validated_data)
        return user

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Handles updates (PATCH requests) to a user's profile.
    """
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        # Includes all fields a user can update on their profile page.
        fields = (
            'first_name', 'last_name', 'email', 'avatar', 'avatar_url', 'city',
            'cleanliness', 'sleep_schedule', 'noise_level', 'guest_frequency',
            'social_level', 'smoking', 'has_pets', 'gender_preference',
            'work_schedule', 'occupation', 'mbti_type', 'budget'
        )
        
    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None