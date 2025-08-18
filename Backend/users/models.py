import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField 

class CustomUser(AbstractUser):
    # We will use the default username, password, email fields from Django's AbstractUser
    
    # Custom fields for our app
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=10, choices=[('Seeker', 'Seeker'), ('Lister', 'Lister')], default='Seeker')
    city = models.CharField(max_length=100, blank=True, null=True)
    avatar = CloudinaryField('avatar', blank=True, null=True)

    # --- FIX: Use a string reference to avoid circular import ---
    favorites = models.ManyToManyField('listings.Listing', related_name="favorited_by", blank=True)

    # Lifestyle and Matching Attributes
    cleanliness = models.IntegerField(default=3) # Scale 1-5
    sleep_schedule = models.CharField(max_length=20, default='Flexible')
    noise_level = models.IntegerField(default=3) # Scale 1-5
    guest_frequency = models.CharField(max_length=20, default='Occasionally')
    social_level = models.CharField(max_length=30, default='Friendly but independent')
    smoking = models.CharField(max_length=20, default='Non-Smoker')
    has_pets = models.BooleanField(default=False)
    
    # Preferences
    gender_preference = models.CharField(max_length=20, default='No Preference')
    work_schedule = models.CharField(max_length=20, default='9-to-5')
    occupation = models.CharField(max_length=50, blank=True, null=True)
    mbti_type = models.CharField(max_length=4, blank=True, null=True)
    
    # Financials (primarily for Seekers)
    budget = models.PositiveIntegerField(default=1000)

    def __str__(self):
        return self.username