from rest_framework import serializers
from .models import Listing, ListingImage
from users.models import CustomUser
from users.serializers import UserSerializer

class ListingImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ListingImage
        fields = ("image_url",)

    def get_image_url(self, obj):
        return obj.image.url if obj.image else ""

class ListingSerializer(serializers.ModelSerializer):
    # For handling multiple image uploads in one request
    images_data = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    # For accepting a list of roommate IDs when creating a listing
    current_roommates = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=CustomUser.objects.all(),
        write_only=True,
        required=False
    )
    # For displaying roommate details when reading a listing
    current_roommates_details = UserSerializer(
        many=True, read_only=True, source="current_roommates"
    )
    # Other read-only fields for displaying data
    lister = UserSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "id", "title", "address", "description", "city", "rent",
            "pets_allowed", "smoking_allowed", "lister", "created_at",
            "latitude", "longitude", "image_url", "images", "images_data",
            "roommates_needed", "current_roommates", "current_roommates_details",
        ]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

    # This custom create method handles the complex logic of saving a listing
    def create(self, validated_data):
        # Pop the image and roommate data from the validated data
        images_data = validated_data.pop("images_data", [])
        current_roommates_data = validated_data.pop("current_roommates", [])
        
        # Create the main Listing object
        listing = Listing.objects.create(**validated_data)

        # Set the roommate relationships
        if current_roommates_data:
            listing.current_roommates.set(current_roommates_data)

        # Set the cover image and create additional ListingImage objects
        if images_data:
            listing.image = images_data[0] # First image is the cover
            listing.save()
            for image_file in images_data:
                ListingImage.objects.create(listing=listing, image=image_file)

        return listing