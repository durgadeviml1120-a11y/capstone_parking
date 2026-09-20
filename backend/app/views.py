from django.contrib.auth.models import User
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.utils import timezone
from django.db import transaction

from .models import (
    ParkingLot,
    Slot,
    Booking,
    Payment,
    AuditLog,
)

from .serializers import (
    SignupSerializer,
    ParkingLotSerializer,
    SlotSerializer,
    BookingSerializer,
    PaymentSerializer,
    CurrentUserSerializer,
)


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]


class ParkingLotListCreateView(generics.ListCreateAPIView):
    queryset = ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise serializers.ValidationError(
                "Only administrators can create parking lots."
            )

        serializer.save()


class SlotListCreateView(generics.ListCreateAPIView):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise serializers.ValidationError(
                "Only administrators can create parking slots."
            )

        serializer.save()

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Booking.objects.all().order_by("-created_at")

        return Booking.objects.filter(user=user).order_by("-created_at")

    @transaction.atomic
    def perform_create(self, serializer):
        slot_id = self.request.data.get("slot")

        # Lock the selected slot
        slot = Slot.objects.select_for_update().get(id=slot_id)

        # Check availability after acquiring the lock
        if not slot.is_available:
            raise serializers.ValidationError(
                "This parking slot is already booked."
            )

        amount = self.request.data.get("amount")

        if not amount:
            raise serializers.ValidationError(
                "Booking amount is required."
            )

        booking = serializer.save(
            user=self.request.user,
            slot=slot,
            amount=amount
        )

        AuditLog.objects.create(
            user=self.request.user,
            action="BOOKING_CREATED",
            details=(
                f"Booking #{booking.id} created "
                f"for Slot {slot.slot_number}"
            )
        )


        
class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        booking = Booking.objects.select_for_update().get(
            id=self.request.data.get("booking")
        )

        if booking.user != self.request.user:
            raise serializers.ValidationError(
                "You cannot pay for another user's booking."
            )

        if booking.status != "PENDING":
            raise serializers.ValidationError(
                "This booking is not available for payment."
            )

        payment = serializer.save(
            amount=booking.amount,
            status="SUCCESS",
            payment_method="UPI",
            paid_at=timezone.now(),
            transaction_id=(
                f"TXN-{booking.id}-{timezone.now().timestamp()}"
            )
        )

        booking.status = "CONFIRMED"
        booking.save()

        booking.slot.is_available = False
        booking.slot.save()

        AuditLog.objects.create(
            user=self.request.user,
            action="PAYMENT_SUCCESS",
            details=(
                f"Payment successful for Booking #{booking.id}, "
                f"Amount Rs.{booking.amount}"
            )
        )


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = [IsAuthenticated]


    def get(self, request):
        user = request.user

        role = "admin" if user.is_staff else "user"

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
        })


class BookingCancelView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.status != "CONFIRMED":
            return Response(
                {
                    "detail": (
                        "Only confirmed bookings can be cancelled."
                    )
                },
                status=400
            )

        booking.status = "CANCELLED"
        booking.save()

        slot = booking.slot
        slot.is_available = True
        slot.save()

        AuditLog.objects.create(
            user=request.user,
            action="BOOKING_CANCELLED",
            details=(
                f"Booking #{booking.id} cancelled. "
                f"Slot {slot.slot_number} released."
            )
        )

        serializer = self.get_serializer(booking)

        return Response({
            "message": "Booking cancelled successfully.",
            "booking": serializer.data
        })