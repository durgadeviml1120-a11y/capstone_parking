from django.contrib import admin
from .models import ParkingLot, Slot, Booking, Payment, AuditLog


admin.site.register(ParkingLot)
admin.site.register(Slot)
admin.site.register(Booking)
admin.site.register(Payment)
admin.site.register(AuditLog)