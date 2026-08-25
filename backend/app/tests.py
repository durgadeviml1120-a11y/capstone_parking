from django.test import TestCase

# Create your tests here.
from datetime import timedelta

import pytest
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient

from .models import ParkingLot, Slot, Booking, Payment


@pytest.mark.django_db
def test_signup():
    client = APIClient()

    response = client.post(
        "/api/auth/signup/",
        {
            "username": "testsignup",
            "email": "testsignup@example.com",
            "password": "password123",
        },
        format="json",
    )

    assert response.status_code == 201
    assert User.objects.filter(username="testsignup").exists()


@pytest.mark.django_db
def test_login():
    user = User.objects.create_user(
        username="loginuser",
        password="password123",
    )

    client = APIClient()

    response = client.post(
        "/api/auth/login/",
        {
            "username": "loginuser",
            "password": "password123",
        },
        format="json",
    )

    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data


@pytest.mark.django_db
def test_parking_lot_and_slot():
    parking_lot = ParkingLot.objects.create(
        name="Test Parking",
        location="Chennai",
        total_slots=10,
    )

    slot = Slot.objects.create(
        parking_lot=parking_lot,
        slot_number=1,
        vehicle_type="CAR",
        is_available=True,
    )

    assert parking_lot.total_slots == 10
    assert slot.is_available is True
    assert slot.vehicle_type == "CAR"


@pytest.mark.django_db
def test_create_booking():
    user = User.objects.create_user(
        username="bookinguser",
        password="password123",
    )

    parking_lot = ParkingLot.objects.create(
        name="Test Parking",
        location="Chennai",
        total_slots=10,
    )

    slot = Slot.objects.create(
        parking_lot=parking_lot,
        slot_number=1,
        vehicle_type="CAR",
        is_available=True,
    )

    client = APIClient()

    client.force_authenticate(user=user)

    start_time = timezone.now()
    end_time = start_time + timedelta(hours=1)

    response = client.post(
        "/api/auth/bookings/",
        {
            "slot": slot.id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "amount": "100.00",
        },
        format="json",
    )

    assert response.status_code == 201
    assert Booking.objects.filter(
        user=user,
        slot=slot
    ).exists()


@pytest.mark.django_db
def test_payment_confirms_booking():
    user = User.objects.create_user(
        username="paymentuser",
        password="password123",
    )

    parking_lot = ParkingLot.objects.create(
        name="Test Parking",
        location="Chennai",
        total_slots=10,
    )

    slot = Slot.objects.create(
        parking_lot=parking_lot,
        slot_number=1,
        vehicle_type="CAR",
        is_available=True,
    )

    start_time = timezone.now()
    end_time = start_time + timedelta(hours=1)

    booking = Booking.objects.create(
        user=user,
        slot=slot,
        start_time=start_time,
        end_time=end_time,
        amount="100.00",
        status="PENDING",
    )

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.post(
        "/api/auth/payments/",
        {
            "booking": booking.id,
        },
        format="json",
    )

    assert response.status_code == 201

    booking.refresh_from_db()
    slot.refresh_from_db()

    assert booking.status == "CONFIRMED"
    assert slot.is_available is False

    assert Payment.objects.filter(
        booking=booking,
        status="SUCCESS"
    ).exists()


@pytest.mark.django_db
def test_cancel_booking():
    user = User.objects.create_user(
        username="canceluser",
        password="password123",
    )

    parking_lot = ParkingLot.objects.create(
        name="Test Parking",
        location="Chennai",
        total_slots=10,
    )

    slot = Slot.objects.create(
        parking_lot=parking_lot,
        slot_number=1,
        vehicle_type="CAR",
        is_available=False,
    )

    start_time = timezone.now()
    end_time = start_time + timedelta(hours=1)

    booking = Booking.objects.create(
        user=user,
        slot=slot,
        start_time=start_time,
        end_time=end_time,
        amount="100.00",
        status="CONFIRMED",
    )

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.patch(
        f"/api/auth/bookings/{booking.id}/cancel/",
        {},
        format="json",
    )

    assert response.status_code == 200

    booking.refresh_from_db()
    slot.refresh_from_db()

    assert booking.status == "CANCELLED"
    assert slot.is_available is True


@pytest.mark.django_db
def test_admin_can_view_all_bookings():
    admin = User.objects.create_user(
        username="testadmin",
        password="password123",
        is_staff=True,
    )

    user = User.objects.create_user(
        username="normaluser",
        password="password123",
    )

    parking_lot = ParkingLot.objects.create(
        name="Test Parking",
        location="Chennai",
        total_slots=10,
    )

    slot = Slot.objects.create(
        parking_lot=parking_lot,
        slot_number=1,
        vehicle_type="CAR",
        is_available=False,
    )

    Booking.objects.create(
        user=user,
        slot=slot,
        start_time=timezone.now(),
        end_time=timezone.now() + timedelta(hours=1),
        amount="100.00",
        status="CONFIRMED",
    )

    client = APIClient()
    client.force_authenticate(user=admin)

    response = client.get("/api/auth/bookings/")

    assert response.status_code == 200

    data = response.data

    if isinstance(data, dict) and "results" in data:
        data = data["results"]

    assert len(data) == 1
    assert data[0]["username"] == "normaluser"