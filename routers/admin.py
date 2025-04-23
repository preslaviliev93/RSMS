from django.contrib import admin
from .models import Routers
# Register your models here.

class RoutersAdmin(admin.ModelAdmin):
    list_display = ('id', 'router_serial', 'router_client', 'router_uptime')
    list_filter = ('router_client', 'router_serial')
    search_fields = ('router_client', 'router_serial')

admin.site.register(Routers, RoutersAdmin)