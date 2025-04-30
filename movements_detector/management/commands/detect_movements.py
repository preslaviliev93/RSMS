from django.core.management.base import BaseCommand
from routers.models import DHCPLeases
from movements_detector.models import MacMovementSnapshot, MacMovementHistory
from django.utils.timezone import now


class Command(BaseCommand):
    help = "Detect MAC address movements"

    def handle(self, *args, **options):
        leases = DHCPLeases.objects.select_related('router_id', 'client_id', 'router_id__location')

        for lease in leases:
            mac = lease.mac_address
            hostname = lease.hostname
            router = lease.router_id
            client = lease.client_id
            location_name = getattr(router.location, 'name', None)

            snapshot, created = MacMovementSnapshot.objects.get_or_create(
                mac_address=mac,
                defaults={
                    'hostname': hostname,
                    'router': router,
                    'client': client,
                    'location_name': location_name
                }
            )

            if created:
                self.stdout.write(f"[NEW] Snapshot created for {mac}")
                continue

            # Check for movement
            moved = False
            movement_type = []
            if snapshot.router != router:
                movement_type.append("router")
                moved = True
            if snapshot.client != client:
                movement_type.append("client")
                moved = True
            if snapshot.location_name != location_name:
                movement_type.append("location")
                moved = True

            if moved:
                MacMovementHistory.objects.create(
                    mac_address=mac,
                    hostname=hostname,
                    from_router=snapshot.router,
                    to_router=router,
                    from_client=snapshot.client,
                    to_client=client,
                    from_location=snapshot.location_name,
                    to_location=location_name,
                    movement_type=",".join(movement_type),
                )

                snapshot.router = router
                snapshot.client = client
                snapshot.location_name = location_name
                snapshot.hostname = hostname
                snapshot.save()

                self.stdout.write(f"[MOVE] {mac} moved ({','.join(movement_type)})")
            else:
                self.stdout.write(f"[OK] No movement for {mac}")


# CRON COMMAND TO RUN THE SCRIPT EVERY HOUR
#                           0 * * * * /path/to/your/venv/bin/python /path/to/your/project/manage.py detect_movements >> /var/log/movement_detector.log 2>&1