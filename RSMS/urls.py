
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('clients/', include('clients.urls')),
    path('statistics/', include('stats.urls')),
    path('routers/', include('routers.urls')),
    path('logs/', include('logging_services.urls')),
    path('locations/', include('locations_manager.urls')),
    path('movements/', include('movements_detector.urls'))
]
