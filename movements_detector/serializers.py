from rest_framework import serializers
from movements_detector.models import MacMovementHistory

class MacMovementHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MacMovementHistory
        fields = '__all__'
