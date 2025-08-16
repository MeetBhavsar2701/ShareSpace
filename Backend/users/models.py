import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # We will use the default username, password, email fields from Django's AbstractUser.
    # The AbstractUser model provides a solid foundation with authentication handled.

    # We replace the default integer ID with a non-guessable UUID.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # --- Profile & Role Fields ---
    role = models.CharField(max_length=10, choices=[('Seeker', 'Seeker'), ('Lister', 'Lister')], default='Seeker')
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # --- Lifestyle & Matching Attributes ---
    # These fields correspond directly to our synthetic dataset columns.
    cleanliness = models.IntegerField(default=3, help_text="Scale from 1 (messy) to 5 (tidy)")
    sleep_schedule = models.CharField(max_length=20, default='Flexible')
    noise_level = models.IntegerField(default=3, help_text="Scale from 1 (silent) to 5 (lively)")
    guest_frequency = models.CharField(max_length=20, default='Occasionally')
    social_level = models.CharField(max_length=30, default='Friendly but independent')
    smoking = models.CharField(max_length=20, default='Non-Smoker')
    has_pets = models.BooleanField(default=False)
    
    # --- Preferences ---
    gender_preference = models.CharField(max_length=20, default='No Preference')
    work_schedule = models.CharField(max_length=20, default='9-to-5')
    occupation = models.CharField(max_length=50, blank=True, null=True)
    mbti_type = models.CharField(max_length=4, blank=True, null=True)
    
    # --- Financials (primarily for Seekers) ---
    budget = models.PositiveIntegerField(default=1000)

    def __str__(self):
        return self.username