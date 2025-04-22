from rest_framework import serializers

class StatsSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.IntegerField()