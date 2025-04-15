from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin



class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_staff', 'role')
    list_filter = ('username', 'is_staff', 'role')
    search_fields = ('username', 'email')
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),  # <-- Add role field here
    )

admin.site.register(User, UserAdmin)