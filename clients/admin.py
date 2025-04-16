from django.contrib import admin
from .models import Client


class ClientAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'client_hostname')
    search_fields = ('client_name', 'client_hostname')
    list_filter = ('client_name',)

admin.site.register(Client, ClientAdmin)
