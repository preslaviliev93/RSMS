from rest_framework import serializers
from .models import Location
from routers.models import DHCPLeases
class DHCPLeaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DHCPLeases
        fields = ['hostname', 'mac_address', 'dhcp_lease_ip_address']



class LocationListSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.client_name')
    router_serial = serializers.CharField(source='router_vpn_ip.router_serial')
    leases_count = serializers.SerializerMethodField()
    class Meta:
        model = Location
        fields = ['id', 'name', 'client_name', 'router_serial', 'leases_count']

    def get_leases_count(self, obj):
        return DHCPLeases.objects.filter(router_id=obj.router_vpn_ip).count()

class LocationDetailSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source="name")
    client_name = serializers.CharField(source='client.client_name')
    client_id = serializers.IntegerField(source='client.id')
    router_serial = serializers.CharField(source='router_vpn_ip.router_serial')
    router_id = serializers.IntegerField(source='router_vpn_ip.id')
    leases = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ['id', 'location_name', 'client_name', 'client_id', 'router_serial', 'router_id', 'leases']

    def get_leases(self, obj):
        leases = DHCPLeases.objects.filter(router_id=obj.router_vpn_ip)
        return [
            {'hostname': lease.hostname,
                'mac_address': lease.mac_address,
                'ip_address': lease.dhcp_lease_ip_address,}
            for lease in leases
        ]



