from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from clients.models import ClientsLogs
from users.models import UserLogs
from clients.serializers import ClientsLogsSerializer
from users.serializers import UserLogsSerializer

# Create your views here.
class LogsView(APIView):
    permission_classes = (IsAuthenticated, IsAdmin,)

    def get(self, request):
        client_logs = ClientsLogs.objects.select_related("client", "user").all()
        user_logs = UserLogs.objects.select_related("user").all()

        serialized_client_logs = ClientsLogsSerializer(client_logs, many=True).data
        serialized_user_logs = UserLogsSerializer(user_logs, many=True).data

        combined_logs = sorted(
            serialized_client_logs + serialized_user_logs,
            key=lambda x: x['timestamp'],
            reverse=True,
        )

        return Response(combined_logs, status=status.HTTP_200_OK)