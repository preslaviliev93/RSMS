from rest_framework import serializers
from .models import Routers, RouterInterfaces, DHCPLeases
from clients.serializers import ClientMiniSerializer
from locations_manager.models import Location
import re


class RouterInterfacesSerializer(serializers.ModelSerializer):

    class Meta:
        model = RouterInterfaces
        fields = ['interface_name', 'interface_type', 'interface_ip', 'interface_is_active']


class DHCPLeasesSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    router_serial = serializers.SerializerMethodField()
    router_id = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    location_id = serializers.SerializerMethodField()

    class Meta:
        model = DHCPLeases
        fields = ['mac_address', 'client_id', 'dhcp_lease_ip_address', 'hostname', 'added_at',
                  'client_name', 'router_serial', 'router_id', 'location_name', "location_id"]

    def get_client_name(self, obj):
        return obj.client_id.client_name if obj.client_id else None
    def get_router_serial(self, obj):
        return obj.router_id.router_serial if obj.router_id else None

    def get_router_id(self, obj):
        return obj.router_id.id if obj.router_id else None

    def get_location_name(self, obj):
        if obj.router_id:
            location = Location.objects.filter(router_vpn_ip=obj.router_id).first()
            return location.name if location else None

    def get_location_id(self, obj):
        if obj.router_id:
            location = Location.objects.filter(router_vpn_ip=obj.router_id).first()
            return location.id if location else None

class RoutersSerializer(serializers.ModelSerializer):
    interfaces = RouterInterfacesSerializer(many=True, read_only=True)
    dhcp_leases = DHCPLeasesSerializer(many=True, read_only=True)
    router_client = ClientMiniSerializer(read_only=True)
    location_name = serializers.SerializerMethodField()

    class Meta:
        model = Routers
        fields = [
            'id', 'router_serial',
            'router_model', 'router_version', 'router_hardware',
            'router_identity', 'router_uplink_ip', 'router_public_ip',
            'router_vpn_mgmt_ip', 'router_client', 'router_hc_client',
            'router_comment', 'router_uptime', 'router_location_country',
            'router_last_seen', 'router_added', 'interfaces', 'dhcp_leases',
            'location_name'
        ]

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

    def get_location_name(self, obj):
        location = Location.objects.filter(router_vpn_ip=obj).first()
        return location.name if location else None

