from django.urls import path
from .views import ClientCreateAPIView, ClientDetailAPIView, ClientLogView, ClientLocationsView

urlpatterns = [
    path('all-clients/', ClientCreateAPIView.as_view(), name='client-create'),
    path('all-clients/<int:pk>/', ClientDetailAPIView.as_view(), name='client-detail'),
    path('logs/', ClientLogView.as_view(), name='client-logs'),
    path('all-clients/<int:pk>/locations/', ClientLocationsView.as_view(), name='client-locations'),


]

