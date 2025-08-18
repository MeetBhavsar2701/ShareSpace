from django.contrib import admin
from .models import Listing, ListingImage # Import ListingImage

admin.site.register(Listing)
admin.site.register(ListingImage) 