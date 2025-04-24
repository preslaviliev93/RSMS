from django.urls import path
from .views import RouterView, RegisterRouterView, RouterDetailView


urlpatterns = [
    path('', RouterView.as_view(), name='routers'),
    path('register-router/', RegisterRouterView.as_view(), name='register-router'),
    path('<int:id>/', RouterDetailView.as_view(), name='router-details'),
]
