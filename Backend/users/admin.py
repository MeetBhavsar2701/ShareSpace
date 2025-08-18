from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    
    # This determines what columns are shown in the main user list
    list_display = ('username', 'email', 'role', 'city', 'is_staff')
    
    # This organizes the fields on the "Edit User" page into logical sections
    fieldsets = UserAdmin.fieldsets + (
        ('Profile & Role', {'fields': ('role', 'city', 'budget')}),
        ('Lifestyle & Habits', {'fields': ('cleanliness', 'sleep_schedule', 'noise_level', 'guest_frequency', 'social_level', 'smoking', 'has_pets')}),
        ('Preferences & Personality', {'fields': ('gender_preference', 'work_schedule', 'occupation', 'mbti_type')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)