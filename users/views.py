from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainSerializer, UserLogsSerializer
from .models import UserLogs
from .permissions import IsAdmin


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainSerializer


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()

            UserLogs.objects.create(
                user=request.user,
                log_type= 'Logout',
                message="User logged out."
            )
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            UserLogs.objects.create(
                user=request.user,
                log_type='Logout',
                message=f"Something failed {str(e)}"
            )


class GetUserLogsView(APIView):
    permission_classes = (IsAuthenticated, IsAdmin,)

    def get(self, request):

        user_logs = UserLogs.objects.all()
        serializer = UserLogsSerializer(user_logs, many=True)
        return Response(serializer.data)
