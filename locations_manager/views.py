import secrets
from django.db.models import Q
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from routers.models import DHCPLeases
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from locations_manager.models import Location, APIKey
from clients.models import Client
from routers.models import Routers, RouterInterfaces
from .pagination import StandardResultsSetPagination
from .serializers import LocationListSerializer, LocationDetailSerializer

class RegisterLocationView(APIView):
    """
    API to register or update Locations based on incoming location data.
    Protected with API Key authentication.
    """
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        api_key = request.headers.get('X-API-KEY')

        if not api_key or not APIKey.objects.filter(key=api_key).exists():
            return Response({'detail': 'Invalid or missing API Key.'}, status=status.HTTP_401_UNAUTHORIZED)

        location_data_list = request.data

        if not isinstance(location_data_list, list):
            return Response({'detail': 'Invalid format. Expected a list of locations.'}, status=status.HTTP_400_BAD_REQUEST)

        created_locations = []
        updated_locations = []
        skipped_entries = []

        for entry in location_data_list:
            tunnel_ip = entry.get('tunnel_ip')
            location_name = entry.get('location_name')
            client_name = entry.get('client_name')

            if not (tunnel_ip and location_name and client_name):
                skipped_entries.append({'entry': entry, 'reason': 'Missing required fields.'})
                continue

            try:
                client = Client.objects.get(client_name=client_name)
            except Client.DoesNotExist:
                skipped_entries.append({'entry': entry, 'reason': f"Client '{client_name}' not found."})
                continue

            interfaces = RouterInterfaces.objects.filter(interface_ip=tunnel_ip)
            matching_interface = None

            for interface in interfaces:
                if interface.router_id.router_client == client:
                    matching_interface = interface
                    break

            if not matching_interface:
                skipped_entries.append({'entry': entry, 'reason': f"No matching router for IP '{tunnel_ip}' and Client '{client_name}'."})
                continue

            router = matching_interface.router_id

            location, created = Location.objects.get_or_create(
                client=client,
                router_vpn_ip=router,
                defaults={'name': location_name}
            )

            if not created:
                if location.name != location_name:
                    location.name = location_name
                    location.save()
                    updated_locations.append({'router_serial': router.router_serial, 'new_location': location_name})
                else:
                    pass
            else:
                created_locations.append({'router_serial': router.router_serial, 'location': location_name})

        return Response({
            'detail': 'Locations processed.',
            'created': created_locations,
            'updated': updated_locations,
            'skipped': skipped_entries
        }, status=status.HTTP_200_OK)


class CreateApiKeyView(APIView):
    """
    API to create new API Keys.
    """
    from users.permissions import IsAdmin
    permission_classes = (IsAdmin, )

    def post(self, request, *args, **kwargs):
        name = request.data.get('name', '')

        # Generate a secure random key
        key = secrets.token_urlsafe(48)

        # Save the new API Key
        api_key = APIKey.objects.create(
            key=key,
            name=name
        )

        return Response({
            'detail': 'API Key created successfully.',
            'key': api_key.key,
            'name': api_key.name,
            'created_at': api_key.created_at
        }, status=status.HTTP_201_CREATED)


class LocationsView(ListAPIView):
    queryset = Location.objects.select_related('client', 'router_vpn_ip').all()
    serializer_class = LocationListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        search = self.request.query_params.get('search')
        exact = self.request.query_params.get('exact') == 'true'
        exclude = self.request.query_params.get('exclude') == 'true'

        qs = self.queryset

        if search:
            if exact:
                query = (
                        Q(name__iexact=search) |
                        Q(client__client_name__iexact=search) |
                        Q(router_vpn_ip__router_serial__iexact=search)
                )
            elif exclude:
                query = ~(
                        Q(name__icontains=search) |
                        Q(client__client_name__icontains=search) |
                        Q(router_vpn_ip__router_serial__icontains=search)
                )
            else:
                query = (
                        Q(name__icontains=search) |
                        Q(client__client_name__icontains=search) |
                        Q(router_vpn_ip__router_serial__icontains=search)
                )

            qs = qs.filter(query)

        return qs


class LocationDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, pk):
        try:
            location = Location.objects.select_related('client', 'router_vpn_ip').get(pk=pk)
        except Location.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LocationDetailSerializer(location)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            location = Location.objects.get(pk=pk)
        except Location.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

        location_name = request.data.get('location_name')
        if location_name:
            location.name = location_name
            location.save()
            return Response({'success': 'Location updated successfully'})
        return Response({'error': 'No location name provided'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            location = Location.objects.get(pk=pk)
        except Location.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

        location.delete()
        return Response({'success': 'Location deleted successfully'}, status=status.HTTP_204_NO_CONTENT)