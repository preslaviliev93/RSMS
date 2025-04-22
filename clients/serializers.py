from rest_framework import serializers

from clients.models import Client


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    def validate_client_name(self, value):
        pk = self.instance.pk if self.instance else None
        if Client.objects.exclude(pk=self.instance.pk).filter(client_name__iexact=value).exists():
            raise serializers.ValidationError("A client with this name already exists.")
        return value


    def create(self, validated_data):
        ...