from django.db import models
from datetime import datetime
from django.utils import timezone
from clients.models import Client

class Routers(models.Model):
    router_serial = models.CharField(max_length=50, null=False, blank=False, default="")
    router_model = models.CharField(max_length=100, null=False, blank=False, default="")
    router_version = models.CharField(max_length=50, null=False, blank=False, default="")
    router_hardware = models.CharField(max_length=100, null=False, blank=False, default="")
    router_identity = models.CharField(max_length=100, null=False, blank=False, default="")
    router_uplink_ip = models.GenericIPAddressField(null=True, blank=True, default="0.0.0.0/0")
    router_public_ip = models.GenericIPAddressField(null=True, blank=True, default="0.0.0.0/0")
    router_vpn_mgmt_ip = models.GenericIPAddressField(null=True, blank=True, default="0.0.0.0/0")
    router_client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="routers", null=True, blank=True)
    router_hc_client = models.CharField(max_length=220, null=False, default="")
    router_comment = models.TextField(null=True, blank=True, default="")
    router_uptime = models.CharField(max_length=50, blank=True, default="")
    router_location_country = models.CharField(max_length=100, blank=True, default="")
    router_last_seen = models.DateTimeField(null=True, blank=True, default=timezone.now)
    router_added = models.DateTimeField(null=True, blank=True, default=timezone.now)

    def __str__(self):
        return self.router_serial


class RouterHeartbeats(models.Model):
    router_id = models.ForeignKey(Routers, on_delete=models.CASCADE, related_name="heartbeats", null=True, blank=True)
    last_heartbeat = models.DateTimeField(null=True, blank=True, default=timezone.now)
    heartbeat_count = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return self.router_id


class RouterInterfaces(models.Model):
    router_id = models.ForeignKey(Routers, on_delete=models.CASCADE, related_name="interfaces", null=True, blank=True)
    interface = models.CharField(max_length=100, null=False, blank=False, default="")
    interface_name = models.CharField(max_length=100, null=False, blank=False, default="")
    interface_ip = models.GenericIPAddressField(null=True, blank=True, default="0.0.0.0/0")
    interface_type = models.CharField(max_length=100, null=False, blank=False, default="")
    interface_is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ("router_id", "interface_name")

    def __str__(self):
        return self.router_id


class DHCPLeases(models.Model):
    router_id = models.ForeignKey(Routers, on_delete=models.CASCADE, related_name="dhcp_leases", null=True, blank=True)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="client_dhcp_leases", null=True, blank=True)
    mac_address = models.CharField(max_length=50, null=False, blank=False, default="")
    dhcp_lease_ip_address = models.GenericIPAddressField(null=True, blank=True, default="0.0.0.0/0")
    hostname = models.CharField(max_length=50, null=False, blank=False, default="")
    added_at = models.DateTimeField(null=True, blank=True, default=timezone.now)




