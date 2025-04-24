import json
from django.utils import timezone
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoutersSerializer
from .paginations import RouterPagination
from .models import Routers, RouterHeartbeats, RouterInterfaces
from django.db.models import Q
from routers.utils import match_client_by_router_identity, update_heartbeat, sync_interfaces



class RouterView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        routers = Routers.objects.all().order_by('router_serial')
        search = request.query_params.get('search', None)
        if search:
            routers = routers.filter(
                Q(router_serial__icontains=search) |
                Q(router_model__icontains=search) |
                Q(router_version__icontains=search) |
                Q(router_hardware__icontains=search) |
                Q(router_identity__icontains=search) |
                Q(router_uplink_ip__icontains=search) |
                Q(router_public_ip__icontains=search) |
                Q(router_vpn_mgmt_ip__icontains=search) |
                Q(router_hc_client__icontains=search) |
                Q(router_hc_client__icontains=search) |
                Q(router_comment__icontains=search) |
                Q(router_uptime__icontains=search) |
                Q(router_location_country__icontains=search) |
                Q(router_last_seen__icontains=search) |
                Q(router_added__icontains=search)
            )
        paginator = RouterPagination()
        result_page = paginator.paginate_queryset(routers, request)
        serializer = RoutersSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class RouterDetailView(RetrieveAPIView):
    queryset = Routers.objects.all()
    serializer_class = RoutersSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'id'



class RegisterRouterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        if request.method.upper() != 'POST':
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        try:
            data = request.data
            print(f"GOT DATA: {data}")
            if isinstance(data, dict) and len(data) == 1:
                raw_data = list(data.keys())[0]
                data = json.loads(data[raw_data])

            router_serial = data.get('router_serial')
            router_identity = data.get('router_identity')
            interfaces = data.pop("tunnels", [])

            matched_client = match_client_by_router_identity(router_identity)

            router, created = Routers.objects.update_or_create(
                router_serial=router_serial,
                defaults={
                    "router_model": data.get("router_model"),
                    "router_version": data.get("router_version"),
                    "router_hardware": data.get("router_hardware"),
                    "router_identity": router_identity,
                    "router_uplink_ip": data.get("router_uplink_ip"),
                    "router_public_ip": data.get("router_public_ip"),
                    "router_vpn_mgmt_ip": data.get("router_tunnel_ip"),
                    "router_uptime": data.get("router_uptime"),
                    "router_client": matched_client,
                    "router_last_seen": timezone.now()
                }
            )

            update_heartbeat(router)
            sync_interfaces(router, interfaces)

            return Response({"message": "Router data received and saved."}, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


