from django.urls import path
from .views import (
    RoomsApiView, RoomApiView, RoomsAvailableApiView,
    UserRegistrationView, UserProfileView, UserBookingsView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # JWT endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Room endpoints
    path('rooms/', RoomsApiView.as_view(), name='rooms-list'),
    path('rooms/<int:room_id>/', RoomApiView.as_view(), name='room-detail'),
    path('rooms/available/', RoomsAvailableApiView.as_view(), name='rooms-available'),
    
    # User related URLs
    path('users/register/', UserRegistrationView.as_view(), name='user-register'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/bookings/', UserBookingsView.as_view(), name='user-bookings'),
] 