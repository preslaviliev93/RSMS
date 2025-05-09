from django.core.management.base import BaseCommand
from django.utils.timezone import now
from routers.models import DHCPLeases
from movements_detector.models import MacMovementSnapshot, MacMovementHistory
from locations_manager.models import Location

INCLUDED_HOSTNAME_KEYWORDS = ["search", "for", "specific", 'hostnames', 'to include']


class Command(BaseCommand):
    help = "Detect MAC address movements and log them into history"

    def log(self, message):
        timestamp = now().strftime("%Y-%m-%d %H:%M:%S")
        self.stdout.write(f"[{timestamp}] {message}")

    def handle(self, *args, **options):
        leases = DHCPLeases.objects.select_related('router_id', 'client_id')

        for lease in leases:
            mac = lease.mac_address
            if not mac:
                self.log("[SKIP] Empty MAC address, skipping...")
                continue

            hostname = lease.hostname or "unknown"
            if not any(keyword in hostname.lower() for keyword in INCLUDED_HOSTNAME_KEYWORDS):
                self.log(f"[SKIP] Hostname '{hostname}' does not match included keywords for MAC {mac}")
                continue

            router = lease.router_id
            client = lease.client_id

            if not router or not client:
                self.log(f"[SKIP] Incomplete lease (router/client missing) for MAC {mac}, skipping...")
                continue

            location_obj = Location.objects.filter(router_vpn_ip=router.router_vpn_mgmt_ip).first()
            location_name = location_obj.name if location_obj else None

            try:
                snapshot = MacMovementSnapshot.objects.get(mac_address=mac)
            except MacMovementSnapshot.DoesNotExist:
                MacMovementSnapshot.objects.create(
                    mac_address=mac,
                    hostname=hostname,
                    router=router,
                    client=client,
                    location_name=location_name
                )
                self.log(f"[INIT] Created snapshot for {mac}")
                continue  # No movement to compare

            if not snapshot.router or not snapshot.client:
                self.log(f"[SKIP] Snapshot for {mac} missing router/client, skipping movement check")
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

                self.log(f"[MOVE] {mac} moved ({','.join(movement_type)})")
