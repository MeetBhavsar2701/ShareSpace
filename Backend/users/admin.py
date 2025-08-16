from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff']
    # Add any custom fields you want to see in the admin list here

admin.site.register(CustomUser, CustomUserAdmin)