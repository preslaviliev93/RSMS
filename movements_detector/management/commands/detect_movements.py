from django.core.management.base import BaseCommand
from django.utils.timezone import now
from routers.models import DHCPLeases
from movements_detector.models import MacMovementSnapshot, MacMovementHistory
from locations_manager.models import Location

INCLUDED_HOSTNAME_KEYWORDS = ["search", "for", "specific", 'hostnames', 'to include']

class Command(BaseCommand):
    help = "Detect MAC address movements and log them into history"

    def handle(self, *args, **options):
        leases = DHCPLeases.objects.select_related('router_id', 'client_id')

        for lease in leases:
            mac = lease.mac_address
            if not mac:
                self.stdout.write("[SKIP] Empty MAC address, skipping...")
                continue

            hostname = lease.hostname or "unknown"
            if not any(keyword in hostname.lower() for keyword in INCLUDED_HOSTNAME_KEYWORDS):
                self.stdout.write(f"[SKIP] Hostname '{hostname}' does not match included keywords for MAC {mac}")
                continue

            router = lease.router_id
            client = lease.client_id

            if not router or not client:
                self.stdout.write(f"[SKIP] Incomplete lease (router/client missing) for MAC {mac}, skipping...")
                continue

            # Resolve location name from Location model
            location_obj = Location.objects.filter(router_vpn_ip=router).first()
            location_name = location_obj.name if location_obj else None

            try:
                snapshot = MacMovementSnapshot.objects.get(mac_address=mac)
            except MacMovementSnapshot.DoesNotExist:
                snapshot = MacMovementSnapshot.objects.create(
                    mac_address=mac,
                    hostname=hostname,
                    router=router,
                    client=client,
                    location_name=location_name
                )
                self.stdout.write(f"[INIT] Created snapshot for {mac}")
                continue  # Don't treat this as movement

            # Check for movement only if snapshot has full data
            if not snapshot.router or not snapshot.client:
                self.stdout.write(f"[SKIP] Snapshot for {mac} missing router/client, skipping movement check")
                continue

            moved = False
            movement_type = []
            if snapshot.router != router:
                movement_type.append("router")
                moved = True
            if snapshot.client != client:
                movement_type.append("client")
                moved = True
            if snapshot.location_name and snapshot.location_name != location_name:
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
