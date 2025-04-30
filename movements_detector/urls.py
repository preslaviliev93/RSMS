from django.urls import path
from .views import MovementHistoryListView

urlpatterns = [
    path('', MovementHistoryListView.as_view(), name='movements_detector'),
]