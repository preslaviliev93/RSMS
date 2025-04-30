from django.db import models
from routers.models import Routers
from clients.models import Client


class MacMovementSnapshot(models.Model):
    mac_address = models.CharField(max_length=50, unique=True)
    hostname = models.CharField(max_length=250, null=True, blank=True)

    router = models.ForeignKey(Routers, on_delete=models.SET_NULL, null=True)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    location_name = models.CharField(max_length=250, null=True, blank=True)

    last_seen = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class MacMovementHistory(models.Model):
    mac_address = models.CharField(max_length=50)
    hostname = models.CharField(max_length=250, null=True, blank=True)

    from_router = models.ForeignKey(Routers, on_delete=models.SET_NULL, null=True, related_name='movement_from_router')
    to_router = models.ForeignKey(Routers, on_delete=models.SET_NULL, null=True, related_name='movement_to_router')

    from_client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, related_name='movement_from_client')
    to_client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, related_name='movement_to_client')

    from_location = models.CharField(max_length=250, null=True, blank=True)
    to_location = models.CharField(max_length=250, null=True, blank=True)
    movement_type = models.CharField(max_length=200, null=True, blank=True)

    moved_at = models.DateTimeField(auto_now_add=True)
