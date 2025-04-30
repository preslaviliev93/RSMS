from rest_framework import serializers
from movements_detector.models import MacMovementHistory
from routers.serializers import RoutersSerializer  # or a simplified version
from clients.serializers import ClientMiniSerializer  # or your existing client serializer

class MacMovementHistorySerializer(serializers.ModelSerializer):

    from_client = ClientMiniSerializer(read_only=True)
    to_client = ClientMiniSerializer(read_only=True)
    from_router = RoutersSerializer(read_only=True)
    to_router = RoutersSerializer(read_only=True)

    class Meta:
        model = MacMovementHistory
        fields = [
            'mac_address', 'hostname', 'from_location', 'to_location',
            'from_router', 'to_router', 'from_client', 'to_client',
            'movement_type', 'moved_at',
        ]
