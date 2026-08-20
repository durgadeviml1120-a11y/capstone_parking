from django.urls import path
from .views import PaymentCreateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import(
    SignupView,
    ParkingLotListCreateView,
    SlotListCreateView,
    BookingListCreateView,
    BookingCancelView,
    CurrentUserView,
    PaymentCreateView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('parking-lots/', ParkingLotListCreateView.as_view(), name='parking_lots'),
    path('slots/', SlotListCreateView.as_view(), name='slots'),
    path('bookings/', BookingListCreateView.as_view(), name='bookings'),
    path('bookings/<int:pk>/cancel/',BookingCancelView.as_view(),name='booking-cancel'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path("payments/", PaymentCreateView.as_view(), name="payment-create"),
]