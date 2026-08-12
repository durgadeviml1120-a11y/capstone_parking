from django.db import models
from django.contrib.auth.models import User


class ParkingLot(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    total_slots = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Slot(models.Model):
    VEHICLE_TYPES = [
        ('BIKE', 'Bike'),
        ('CAR', 'Car'),
        ('TRUCK', 'Truck'),
    ]

    parking_lot = models.ForeignKey(
        ParkingLot,
        on_delete=models.CASCADE,
        related_name='slots'
    )
    slot_number = models.PositiveIntegerField()
    vehicle_type = models.CharField(
        max_length=10,
        choices=VEHICLE_TYPES
    )
    is_available = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['parking_lot', 'slot_number'],
                name='unique_slot_per_parking_lot'
            )
        ]

    def __str__(self):
        return f"{self.parking_lot.name} - Slot {self.slot_number}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    slot = models.ForeignKey(
        Slot,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username}"


class Payment(models.Model):
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='payment'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    transaction_id = models.CharField(
        max_length=100,
        unique=True
    )
    status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUS,
        default='PENDING'
    )
    payment_method = models.CharField(
        max_length=50,
        default='UPI'
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Payment {self.transaction_id}"


class AuditLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.timestamp}"