from rest_framework import serializers
from users.models import User
from clients.models import Client, ClientsLogs


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    def validate_client_name(self, value):
        if Client.objects.exclude(pk=self.instance.pk if self.instance else None).filter(
                client_name__iexact=value).exists():
            raise serializers.ValidationError("A client with this name already exists.")
        return value


    def create(self, validated_data):
        return Client.objects.create(**validated_data)




class ClientMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'client_name']

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ClientsLogsSerializer(serializers.ModelSerializer):
    client = ClientMiniSerializer(read_only=True)
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = ClientsLogs
        fields = '__all__'
