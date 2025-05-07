import json
from django.utils import timezone
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoutersSerializer, DHCPLeasesSerializer
from .paginations import RouterPagination, DHCPLeasesPagination
from .models import Routers,  DHCPLeases
from django.db.models import Q
from routers.utils import (match_client_by_router_identity, update_heartbeat, sync_interfaces,
                           get_router_id_by_router_serial, get_router_client_by_serial)
from locations_manager.models import Location
from django.db import transaction

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
                Q(router_added__icontains=search) |
                Q(location__name__icontains=search)
            )
        client_id = request.query_params.get('client_id')
        if client_id:
            routers = routers.filter(router_client_id=client_id)

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
            # LEFT FOR DEBUG PURPOSES #
            # print(f"Requested method: {request.method}")
            # print(f"Received data before converting to json format {request.data}")

            # Fixing issue when older Mikrotik ROS versions send "<QUERYDICT...>" instead of JSON

            if isinstance(request.data, dict) and len(request.data) ==1:
                raw_data = list(request.data.keys())[0]
                data = json.loads(raw_data)
            else:
                data = request.data


            router_serial = data.get('router_serial')
            router_identity = data.get('router_identity')
            interfaces = data.pop("tunnels", [])

            matched_client = match_client_by_router_identity(router_identity)
            # print(f"Raw data after loading: {data}")

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
                    "router_location_country": data.get("router_location_country", ""),
                    "router_client": matched_client,
                    "router_last_seen": timezone.now()
                }
            )

            update_heartbeat(router)
            sync_interfaces(router, interfaces)

            return Response({"message": "Router data received and saved."}, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError as e:
            # print(f"Json Decode Error: {str(e)}")
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterDHCPLeases(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        if request.method.upper() != 'POST':
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        try:
            # Parse data
            if isinstance(request.data, dict) and len(request.data) == 1:
                raw_data = list(request.data.keys())[0]
                data = json.loads(raw_data)
            else:
                data = request.data

            router_serial = data.get('router_serial')
            leases = data.get('mac_leases')
            router_id = get_router_id_by_router_serial(router_serial)
            client = get_router_client_by_serial(router_serial)

            macs_in_request = [lease['mac_address'] for lease in leases]

            with transaction.atomic():
                DHCPLeases.objects.filter(router_id=router_id).exclude(mac_address__in=macs_in_request).delete()

                for lease in leases:
                    DHCPLeases.objects.update_or_create(
                        router_id=router_id,
                        mac_address=lease['mac_address'],
                        defaults={
                            "mac_address": lease['mac_address'],
                            "client_id": client,
                            "dhcp_lease_ip_address": lease['internal_ip'],
                            "hostname": lease['hostname'],
                            "added_at": timezone.now()
                        }
                    )

            return Response({"message": "Router data received and saved."}, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ClientDHCPLeasesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        client_id = request.query_params.get('client_id')
        if not client_id:
            return Response({"error": "Missing client_id parameter."}, status=status.HTTP_400_BAD_REQUEST)

        leases = DHCPLeases.objects.filter(client_id=client_id).order_by('-added_at')

        paginator = DHCPLeasesPagination()
        result_page = paginator.paginate_queryset(leases, request)
        serializer = DHCPLeasesSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class AllMachinesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        search = request.query_params.get('search', None)
        leases = DHCPLeases.objects.select_related('client_id', 'router_id').order_by('-added_at')
        if search:
            leases = leases.filter(
                Q(hostname__icontains=search) |
                Q(mac_address__icontains=search) |
                Q(dhcp_lease_ip_address__icontains=search) |
                Q(client_id__client_name__icontains=search) |
                Q(router_id__router_serial__icontains=search) |
                Q(router_id__location__name__icontains=search)
            )
        paginator = DHCPLeasesPagination()
        result_page = paginator.paginate_queryset(leases, request)
        serializer = DHCPLeasesSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)