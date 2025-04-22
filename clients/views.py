from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from clients.models import Client
from clients.serializers import ClientSerializer
from .permissions import IsAdminOrReadOnly
from .paginations import ClientPagination
from django.db.models import Q

class ClientCreateAPIView(APIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)



    def get(self, request):
        clients = Client.objects.all().order_by('-id')
        search = request.query_params.get('search')
        if search:
            clients = clients.filter(
                Q(client_name__icontains=search) |
                Q(client_city__icontains=search) |
                Q(client_country__icontains=search) |
                Q(client_data_center__icontains=search) |
                Q(client_hostname__icontains=search) |
                Q(client_router_prefix__icontains=search) |
                Q(client_address__icontains=search)
            )
        paginator = ClientPagination()
        result_page = paginator.paginate_queryset(clients, request)
        serializer = ClientSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        client = self.get_object(pk)
        if not client:
            return Response(status=status.HTTP_404_NOT_FOUND)
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
