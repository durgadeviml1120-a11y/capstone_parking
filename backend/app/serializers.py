from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ParkingLot, Slot , Booking

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
    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'slot',
            'start_time',
            'end_time',
            'amount',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']
