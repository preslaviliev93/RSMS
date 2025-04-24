from django.urls import path
from .views import (RouterView, RegisterRouterView, RouterDetailView, RegisterDHCPLeases, ClientDHCPLeasesView,
                    AllMachinesView)


urlpatterns = [
    path('', RouterView.as_view(), name='routers'),
    path('register-router/', RegisterRouterView.as_view(), name='register-router'),
    path('<int:id>/', RouterDetailView.as_view(), name='router-details'),
    path('register_dhcp_leases/', RegisterDHCPLeases.as_view(), name='register-dhcp-leases'),
    path('client-leases/', ClientDHCPLeasesView.as_view(), name='client-dhcp-leases'),
    path('all-leases/', AllMachinesView.as_view(), name='all-leases' )
]
