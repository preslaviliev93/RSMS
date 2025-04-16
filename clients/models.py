from django.db import models

class Client(models.Model):
    client_name = models.CharField(max_length=100)
    client_country = models.CharField(max_length=100)
    client_city = models.CharField(max_length=100)
    client_address = models.CharField(max_length=100)
    client_data_center = models.CharField(max_length=100)
    client_routers = models.IntegerField() #this fill be foreign key from the routers table