import uuid
from django.db import models
from users.models import CustomUser
from cloudinary.models import CloudinaryField

class Listing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lister = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    address = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    rent = models.PositiveIntegerField()
    pets_allowed = models.BooleanField(default=False)
    smoking_allowed = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    # We will use the related 'listingimage_set' to get all images.
    # We can keep this field to store a primary/cover image.
    image = CloudinaryField('image', blank=True, null=True)

    def __str__(self):
        return self.title

# --- NEW MODEL ---
class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image')

    def __str__(self):
        return f"Image for {self.listing.title}"