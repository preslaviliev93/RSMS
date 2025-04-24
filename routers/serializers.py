from rest_framework import serializers
from .models import Routers, RouterInterfaces, DHCPLeases
from clients.serializers import ClientMiniSerializer
import re


class RouterInterfacesSerializer(serializers.ModelSerializer):

    class Meta:
        model = RouterInterfaces
        fields = ['interface_name', 'interface_type', 'interface_ip', 'interface_is_active']


class DHCPLeasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DHCPLeases
        fields = ['mac_address', 'client_id', 'dhcp_lease_ip_address', 'hostname', 'added_at']


class RoutersSerializer(serializers.ModelSerializer):
    interfaces = RouterInterfacesSerializer(many=True, read_only=True)
    dhcp_leases = DHCPLeasesSerializer(many=True, read_only=True)
    router_client = ClientMiniSerializer(read_only=True)

    class Meta:
        model = Routers
        fields = '__all__'

    def validate_router_serial(self, value):
        if 0 <= len(value) >= 50:
            raise serializers.ValidationError('Router Serial Number must be between 1-50 characters long')
        pattern = r'^([a-zA-Z0-9_-]*)$'
        if not re.match(pattern, value):
            raise serializers.ValidationError('Invalid Router Serial Number')



    def validate_router_version(self, value):
        if 0 <= len(value) >= 20:
            raise serializers.ValidationError('Router Version Number must be between 1-20 characters long')


    def create(self, validated_data):
        router_identity = validated_data.get("router_identity")

        return super().create(validated_data)


