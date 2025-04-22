from django.db import models

from users.models import User


class Client(models.Model):
    client_name = models.CharField(max_length=100, unique=True)
    client_description = models.TextField()
    client_country = models.CharField(max_length=100)
    client_city = models.CharField(max_length=100)
    client_hostname=models.CharField(max_length=100)
    client_router_prefix = models.CharField(max_length=100)
    client_address = models.CharField(max_length=100, null=True, blank=True)
    client_data_center = models.CharField(max_length=100)
    client_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.client_name


class ClientsLogs(models.Model):
    log_type = models.CharField(max_length=100)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.log_type

