from datetime import datetime
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from clients.models import Client, ClientsLogs
from routers.models import Routers, DHCPLeases, RouterHeartbeats

class ClientsByDateView(APIView):
    def get(self, request):
        try:
            start = request.query_params.get('start')
            end = request.query_params.get('end')

            if not start or not end:
                return Response({"error": "Missing start or end date"}, status=status.HTTP_400_BAD_REQUEST)

            start_date = datetime.strptime(start, '%Y-%m-%d').date()
            end_date = datetime.strptime(end, '%Y-%m-%d').date()

            # Grouped by day
            clients = (
                Client.objects
                .filter(client_added__date__range=[start_date, end_date])
                .annotate(date=TruncDate('client_added'))
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
            )

            logs = (
                ClientsLogs.objects
                .filter(timestamp__date__range=[start_date, end_date])
                .annotate(date=TruncDate('timestamp'))
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
            )

            routers = (
                Routers.objects
                .filter(router_added__date__range=[start_date, end_date])
                .annotate(date=TruncDate('router_added'))
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
            )

            macs = (
                DHCPLeases.objects
                .filter(added_at__date__range=[start_date, end_date])
                .annotate(date=TruncDate('added_at'))
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
            )

            # Global totals
            total_clients = Client.objects.count()
            total_logs = ClientsLogs.objects.count()
            total_macs = DHCPLeases.objects.count()
            total_routers = Routers.objects.count()
            total_heartbeats = RouterHeartbeats.objects.aggregate(total=Sum('heartbeat_count'))['total'] or 0

            return Response({
                'clients': list(clients),
                'logs': list(logs),
                'routers': list(routers),
                'machines': list(macs),
                'total_clients': total_clients,
                'total_logs': total_logs,
                'total_routers': total_routers,
                'total_macs': total_macs,
                'total_heartbeats': total_heartbeats,
            })

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
