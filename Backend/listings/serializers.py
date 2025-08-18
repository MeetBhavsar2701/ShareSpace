from rest_framework import serializers
from .models import Listing, ListingImage
from users.models import CustomUser
from users.serializers import UserSerializer 

class ListingImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ListingImage
        fields = ('image_url',)

    def get_image_url(self, obj):
        try:
            return obj.image.url if obj.image else ''
        except Exception:
            return ''

class ListingSerializer(serializers.ModelSerializer):
    lister = UserSerializer(read_only=True)
    images_data = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    images = ListingImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    compatibility_score = serializers.IntegerField(read_only=True, required=False)
    is_favorited = serializers.SerializerMethodField()
    current_roommates = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=CustomUser.objects.all(),
        write_only=True, # Only for input
        required=False
    )
    current_roommates_details = UserSerializer(many=True, read_only=True, source='current_roommates')


    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'address', 'description', 'city', 'rent',
            'pets_allowed', 'smoking_allowed', 'lister', 'created_at',
            'latitude', 'longitude', 'image_url', 'images', 'images_data',
            'compatibility_score', 'roommates_needed', 'roommates_found',
            'current_roommates', 'current_roommates_details' ,'is_favorited'
        ]

    def get_image_url(self, obj):
        try:
            return obj.image.url if obj.image else None
        except Exception:
            return None

    def create(self, validated_data):
        images_data = validated_data.pop('images_data', None)
        current_roommates_data = validated_data.pop('current_roommates', [])
        listing = Listing.objects.create(**validated_data)
        
        if current_roommates_data:
            listing.current_roommates.set(current_roommates_data)

        if images_data:
            listing.image = images_data[0]
            listing.save()
            for image_data in images_data:
                ListingImage.objects.create(listing=listing, image=image_data)
        return listing
    
    def get_is_favorited(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return user.favorites.filter(id=obj.id).exists()
        return False