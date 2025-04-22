from django.db import models


class Client(models.Model):
    client_name = models.CharField(max_length=100, unique=True)
    client_description = models.TextField()
    client_country = models.CharField(max_length=100)
    client_city = models.CharField(max_length=100)
    client_hostname= models.CharField(max_length=100)
    client_router_prefix = models.CharField(max_length=100)
    client_address = models.CharField(max_length=100, null=True, blank=True)
    client_data_center = models.CharField(max_length=100)

    def __str__(self):
        return self.client_name

