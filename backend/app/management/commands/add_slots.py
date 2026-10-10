from django.core.management.base import BaseCommand
from app.models import ParkingLot, Slot

class Command(BaseCommand):
    help = 'Automatically create parking slots'

    def add_arguments(self, parser):
        parser.add_argument('--lot-name', type=str, default='Airport Parking')
        parser.add_argument('--count', type=int, default=50)

    def handle(self, *args, **options):
        lot_name = options['lot_name']
        slot_count = options['count']

        try:
            lot = ParkingLot.objects.get(name=lot_name)
        except ParkingLot.DoesNotExist:
            print(f'Error: Parking lot "{lot_name}" not found')
            return

        vehicle_types = ['BIKE', 'CAR', 'TRUCK']

        for i in range(1, slot_count + 1):
            vehicle_type = vehicle_types[i % 3]
            
            Slot.objects.create(
                parking_lot=lot,
                slot_number=f"A{i:02d}",
                vehicle_type=vehicle_type,
                is_available=True
            )

        print(f'✅ Created {slot_count} slots for {lot_name}!')