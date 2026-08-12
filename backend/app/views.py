from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import ParkingLot, Slot,Booking
from .serializers import (
    SignupSerializer,
    ParkingLotSerializer,
    SlotSerializer,
    BookingSerializer,
)


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]


class ParkingLotListCreateView(generics.ListCreateAPIView):
    queryset = ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer


class SlotListCreateView(generics.ListCreateAPIView):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)