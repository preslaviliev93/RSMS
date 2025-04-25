from rest_framework import serializers
from clients.models import ClientsLogs
from users.models import UserLogs

class ClientsLogsSerializer(serializers.ModelSerializer):
    ...