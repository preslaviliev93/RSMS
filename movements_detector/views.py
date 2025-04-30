from rest_framework.generics import ListAPIView
from movements_detector.models import MacMovementHistory
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from .serializers import MacMovementHistorySerializer

class MovementHistoryListView(ListAPIView):
    queryset = MacMovementHistory.objects.all().order_by('-moved_at')
    serializer_class = MacMovementHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['mac_address', 'hostname', 'from_location', 'to_location']
