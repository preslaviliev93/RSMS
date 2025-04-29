from django.db import models
from clients.models import Client
from routers.models import Routers


class Location(models.Model):
    name = models.CharField(max_length=250)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    router_vpn_ip = models.ForeignKey(Routers, on_delete=models.CASCADE)


class APIKey(models.Model):
    key = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name or 'Unknown API Key'}"
