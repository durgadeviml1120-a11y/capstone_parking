from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ParkingLot, Slot, Booking, Payment,AuditLog

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


class ParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingLot
        fields = '__all__'


class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    slot_number = serializers.IntegerField(
        source="slot.slot_number",
        read_only=True
    )

    vehicle_type = serializers.CharField(
        source="slot.vehicle_type",
        read_only=True
    )

    parking_location = serializers.CharField(
        source="slot.parking_lot.location",
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'username',
            'slot',
            'slot_number',
            'vehicle_type',
            'parking_location',
            'start_time',
            'end_time',
            'amount',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'username',
            'slot_number',
            'vehicle_type',
            'parking_location',
            'created_at',
        ]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'booking',
            'amount',
            'transaction_id',
            'status',
            'payment_method',
            'paid_at',
        ]
        read_only_fields = [
            'id',
            'amount',
            'transaction_id',
            'status',
            'paid_at',
        ]
class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'user',
            'username',
            'action',
            'details',
            'timestamp',
        ]
        read_only_fields = [
            'id',
            'user',
            'username',
            'action',
            'details',
            'timestamp',
        ]