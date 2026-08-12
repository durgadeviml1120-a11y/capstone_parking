from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import(
    SignupView,
    ParkingLotListCreateView,
    SlotListCreateView,
    BookingListCreateView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('parking-lots/', ParkingLotListCreateView.as_view(), name='parking_lots'),
    path('slots/', SlotListCreateView.as_view(), name='slots'),
    path('bookings/', BookingListCreateView.as_view(), name='bookings'),
]