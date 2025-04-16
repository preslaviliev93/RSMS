from rest_framework import serializers

from clients.models import Client


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    def validate_client_name(self, value):
        pk = self.instance.pk if self.instance else None
        if Client.objects.exclude(pk).filter(client_name__iexcact=value).exists():
            raise serializers.ValidationError("A client with this name already exists.")


    def create(self, validated_data):
        ...