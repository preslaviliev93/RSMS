from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from clients.models import Client, ClientsLogs
from .serializers import StatsSerializer


class ClientsByDateView(APIView):
    def get(self, request):
        try:
            start = request.query_params.get('start')
            end = request.query_params.get('end')

            if not start or not end:
                return Response({"error": "Missing start or end date"}, status=status.HTTP_400_BAD_REQUEST)

            start_date = datetime.strptime(start, '%Y-%m-%d').date()
            end_date = datetime.strptime(end, '%Y-%m-%d').date()

            clients = Client.objects.filter(client_added__date__range=[start_date, end_date])
            logs = ClientsLogs.objects.filter(timestamp__date__range=[start_date, end_date])


            data = {
                'clients': [{'label': 'Clients', 'value': clients.count()}],
                'logs': [{'label': 'Logs', 'value': logs.count()}]
            }

            return Response(data)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

