from django.urls import path
from .views import LocationsView, RegisterLocationView, CreateApiKeyView, LocationDetailView

urlpatterns = [
    path('', LocationsView.as_view(), name='locations'),
    path('register-location/', RegisterLocationView.as_view(), name='register_location'),
    path('create-apikey/', CreateApiKeyView.as_view(), name='create_api_key'),
    path('<int:pk>/', LocationDetailView.as_view(), name='location_detailed'),

]