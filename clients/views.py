from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from clients.models import Client, ClientsLogs
from clients.serializers import ClientSerializer, ClientsLogsSerializer
from .permissions import IsAdminOrReadOnly
from .paginations import ClientPagination, ClientsLogsPagination
from django.db.models import Q
from locations_manager.models import Location
from locations_manager.serializers import LocationListSerializer


class ClientCreateAPIView(APIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)



    def get(self, request):
        clients = Client.objects.all().order_by('-id')
        search = request.query_params.get('search')
        exact = request.query_params.get('exact') == 'true'
        exclude = request.query_params.get('exclude') == 'true'

        if search:
            search_q = Q(client_name__icontains=search) | Q(client_city__icontains=search) | Q(
                client_country__icontains=search) | Q(client_data_center__icontains=search) | Q(
                client_hostname__icontains=search) | Q(client_router_prefix__icontains=search) | Q(
                client_address__icontains=search)

            if exact:
                search_q = (
                        Q(client_name__iexact=search) |
                        Q(client_city__iexact=search) |
                        Q(client_country__iexact=search) |
                        Q(client_data_center__iexact=search) |
                        Q(client_hostname__iexact=search) |
                        Q(client_router_prefix__iexact=search) |
                        Q(client_address__iexact=search)
                )
            elif exclude:
                search_q = ~(
                        Q(client_name__icontains=search) |
                        Q(client_city__icontains=search) |
                        Q(client_country__icontains=search) |
                        Q(client_data_center__icontains=search) |
                        Q(client_hostname__icontains=search) |
                        Q(client_router_prefix__icontains=search) |
                        Q(client_address__icontains=search)
                )

            clients = clients.filter(search_q)

        paginator = ClientPagination()
        result_page = paginator.paginate_queryset(clients, request)
        serializer = ClientSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            client = serializer.save()
            ClientsLogs.objects.create(
                log_type='add',
                client=client,
                user=request.user,
                action=f"Client {client.client_name} was added"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientDetailAPIView(APIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)

    def get_object(self, pk):
        try:
            return Client.objects.get(pk=pk)
        except Client.DoesNotExist:
            return None

    def get(self, request, pk):
        client = self.get_object(pk)
        if not client:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ClientSerializer(client)
        return Response(serializer.data)


    def put(self, request, pk):
        client = self.get_object(pk)
        if not client:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ClientSerializer(client, data=request.data)
        if serializer.is_valid():
            client = serializer.save()
            ClientsLogs.objects.create(
                log_type='update',
                client=client,
                user=request.user,
                action=f"Client {client.client_name} was updated"
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        client = self.get_object(pk)
        if not client:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            log = ClientsLogs(
                log_type='delete',
                client=client,
                user=request.user,
                action=f'Client "{client.client_name}" was deleted.'
            )
            log.save(force_insert=True)
            print("Log saved manually:", log.pk)
        except Exception as e:
            print("Log failed:", e)

        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClientLogView(APIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    def get_object(self):
        try:
            return ClientsLogs.objects.all()
        except ClientsLogs.DoesNotExist:
            return None

    def get(self, request):
        logs = ClientsLogs.objects.all().order_by('-timestamp')
        search = request.query_params.get('search')
        if search:
            clients = logs.filter(
                Q(log_type__icontains=search) |
                Q(client_name__icontains=search) |
                Q(user__icontains=search) |
                Q(action__icontains=search) |
                Q(timestamp__icontains=search)
            )
        paginator = ClientsLogsPagination()
        result_page = paginator.paginate_queryset(logs, request)
        serializer = ClientsLogsSerializer(result_page, many=True)
        return Response(serializer.data)



class ClientLocationsView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, pk):

        try:
            client = Client.objects.get(pk=pk)
        except Client.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        locations = Location.objects.filter(client=client)
        serializer = LocationListSerializer(locations, many=True)
        return Response(serializer.data)


