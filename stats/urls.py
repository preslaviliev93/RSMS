from django.urls import path
from .views import ClientsByDateView
urlpatterns = [
    path('', ClientsByDateView.as_view(), name='clients-stats'),
]