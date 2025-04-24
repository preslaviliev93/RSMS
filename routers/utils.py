def match_client_by_router_identity(identity: str):
    """
    Gets the id of the client to which the router belongs by matching the identity of the router and
    router_prefix from the Client model
    :param identity:
    :return:
    """
    from clients.models import Client
    return Client.objects.filter(client_router_prefix__iexact=identity).first()


def update_heartbeat(router):
    from routers.models import RouterHeartbeats
    from django.utils import timezone

    heartbeat, created = RouterHeartbeats.objects.get_or_create(
        router_id=router,
        defaults={"last_heartbeat": timezone.now(), "heartbeat_count": 1}
    )
    if not created:
        heartbeat.last_heartbeat = timezone.now()
        heartbeat.heartbeat_count += 1
        heartbeat.save()


def sync_interfaces(router, interfaces_data):
    from .models import RouterInterfaces

    for interface in interfaces_data:
        ip = interface["tunnel_ips"][0] if interface.get("tunnel_ips") else None

        RouterInterfaces.objects.update_or_create(
            router_id=router,
            interface_name=interface["tunnel_name"],  # match ONLY by interface_name
            defaults={
                "interface": interface["tunnel_name"],
                "interface_ip": ip,
                "interface_type": interface["tunnel_type"],
                "interface_is_active": interface["tunnel_is_active"],
            }
        )


def get_router_id_by_router_serial(router_serial):
    from routers.models import Routers
    return Routers.objects.filter(router_serial__iexact=router_serial).first()


def get_router_client_by_serial(router_serial):
    from routers.models import Routers
    router = Routers.objects.filter(router_serial__iexact=router_serial).select_related('router_client').first()
    return router.router_client if router and router.router_client else None