from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainSerializer, UserLogsSerializer, UserSerializer, ChangePasswordSerializer
from .models import UserLogs
from .permissions import IsAdmin
from .utils import create_user_log


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainSerializer


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            create_user_log(request.user, 'Logout', "Logged out.")
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            create_user_log(request.user, "Error", str(e))


class GetUserLogsView(APIView):
    permission_classes = (IsAuthenticated, IsAdmin,)

    def get(self, request):

        user_logs = UserLogs.objects.all()
        serializer = UserLogsSerializer(user_logs, many=True)
        return Response(serializer.data)


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            create_user_log(request.user, "Edit Profile", "Editet profile information.")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            create_user_log(request.user, "Password Change", "Password changed successfully.")

            return Response({'detail': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

