from rest_framework import serializers
from .models import Listing, ListingImage

class ListingImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ListingImage
        fields = ('image_url',)

    def get_image_url(self, obj):
        return obj.image.url if obj.image else ''

class ListingSerializer(serializers.ModelSerializer):
    lister_username = serializers.CharField(source='lister.username', read_only=True)
    images_data = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    images = ListingImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'address', 'description', 'city', 'rent',
            'pets_allowed', 'smoking_allowed', 'lister_username', 'created_at',
            'latitude', 'longitude', 'image_url', 'images', 'images_data'
        ]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

    def create(self, validated_data):
        images_data = validated_data.pop('images_data', None)
        listing = Listing.objects.create(**validated_data)

        if images_data:
            listing.image = images_data[0]
            listing.save()
            for image_data in images_data:
                ListingImage.objects.create(listing=listing, image=image_data)
        return listing