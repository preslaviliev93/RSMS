from django.urls import path
from .views import ClientCreateAPIView, ClientDetailAPIView

urlpatterns = [
    path('all-clients/', ClientCreateAPIView.as_view(), name='client-create'),
    path('all-clients/<int:pk>/', ClientDetailAPIView.as_view(), name='client-detail'),
]