from django.shortcuts import render
from rest_framework.views import APIView
from .models import Room, RoomPhoto, Booking, User
from .serializers import (
    RoomSerializer, RoomPhotoSerializer, BookingSerializer,
    UserSerializer, UserCreateSerializer
)
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q
from datetime import datetime
from rest_framework.permissions import IsAuthenticated, AllowAny


class RoomsApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        rooms = Room.objects.filter(is_available=True)
        serializer = RoomSerializer(rooms, many=True)
        return Response({"rooms": serializer.data}, status=status.HTTP_200_OK)
    
    
class RoomApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, room_id, *args, **kwargs):
        try:
            room = Room.objects.get(id=room_id)
            room_serializer = RoomSerializer(room)
            photos = RoomPhoto.objects.filter(room_id=room_id)
            photos_serializer = RoomPhotoSerializer(photos, many=True)

            return Response({
                "room": room_serializer.data, 
                "photos": photos_serializer.data
            }, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class RoomsAvailableApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            check_in_date = request.GET.get('check_in_date')
            check_out_date = request.GET.get('check_out_date')

            if not check_in_date or not check_out_date:
                return Response(
                    {"error": "Both check_in_date and check_out_date are required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            check_in = datetime.strptime(check_in_date, '%Y-%m-%d').date()
            check_out = datetime.strptime(check_out_date, '%Y-%m-%d').date()

            if check_in >= check_out:
                return Response(
                    {"error": "Check-in date must be before check-out date"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Найти все номера, у которых есть пересекающиеся бронирования
            booked_rooms = Booking.objects.filter(
                Q(check_in_date__lt=check_out) & 
                Q(check_out_date__gt=check_in) &
                Q(status__in=['pending', 'confirmed'])
            ).values_list('room_id', flat=True)

            # Исключить такие номера из доступных
            available_rooms = Room.objects.filter(
                is_available=True
            ).exclude(
                id__in=booked_rooms
            )

            serializer = RoomSerializer(available_rooms, many=True)
            return Response({
                "available_rooms": serializer.data,
                "check_in_date": check_in_date,
                "check_out_date": check_out_date
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, *args, **kwargs):
        try:
            room_id = request.data.get('room_id')
            check_in_date = request.data.get('check_in_date')
            check_out_date = request.data.get('check_out_date')

            if not all([room_id, check_in_date, check_out_date]):
                return Response(
                    {"error": "room_id, check_in_date, and check_out_date are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert string dates to datetime objects
            check_in = datetime.strptime(check_in_date, '%Y-%m-%d').date()
            check_out = datetime.strptime(check_out_date, '%Y-%m-%d').date()

            # Validate dates
            if check_in >= check_out:
                return Response(
                    {"error": "Check-in date must be before check-out date"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if check_in < datetime.now().date():
                return Response(
                    {"error": "Check-in date cannot be in the past"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if room exists and is available
            try:
                room = Room.objects.get(id=room_id, is_available=True)
            except Room.DoesNotExist:
                return Response(
                    {"error": "Room not found or not available"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if room is already booked for these dates
            existing_booking = Booking.objects.filter(
                room=room,
                status__in=['pending', 'confirmed'],
                check_in_date__lt=check_out,
                check_out_date__gt=check_in
            ).exists()

            if existing_booking:
                return Response(
                    {"error": "Room is already booked for these dates"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate total price
            nights = (check_out - check_in).days
            total_price = room.price_per_night * nights

            # Create booking
            booking = Booking.objects.create(
                user=request.user,
                room=room,
                check_in_date=check_in,
                check_out_date=check_out,
                total_price=total_price,
                status='pending'
            )

            serializer = BookingSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, booking_id, *args, **kwargs):
        try:
            # Get the booking and verify it belongs to the user
            booking = Booking.objects.get(id=booking_id, user=request.user)
            
            # Check if the booking can be cancelled (e.g., not already cancelled)
            if booking.status == 'cancelled':
                return Response(
                    {"error": "Booking is already cancelled"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update booking status to cancelled instead of deleting
            booking.status = 'cancelled'
            booking.save()
            
            return Response(
                {"message": "Booking cancelled successfully"},
                status=status.HTTP_200_OK
            )
            
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or you don't have permission to cancel it"},
                status=status.HTTP_404_NOT_FOUND
            )


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        bookings = request.user.booking_set.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        try:
            room_id = request.data.get('room_id')
            check_in_date = request.data.get('check_in_date')
            check_out_date = request.data.get('check_out_date')

            if not all([room_id, check_in_date, check_out_date]):
                return Response(
                    {"error": "room_id, check_in_date, and check_out_date are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert string dates to datetime objects
            check_in = datetime.strptime(check_in_date, '%Y-%m-%d').date()
            check_out = datetime.strptime(check_out_date, '%Y-%m-%d').date()

            # Validate dates
            if check_in >= check_out:
                return Response(
                    {"error": "Check-in date must be before check-out date"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if check_in < datetime.now().date():
                return Response(
                    {"error": "Check-in date cannot be in the past"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if room exists and is available
            try:
                room = Room.objects.get(id=room_id, is_available=True)
            except Room.DoesNotExist:
                return Response(
                    {"error": "Room not found or not available"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if room is already booked for these dates
            existing_booking = Booking.objects.filter(
                room=room,
                status__in=['pending', 'confirmed'],
                check_in_date__lte=check_out,
                check_out_date__gte=check_in
            ).exists()

            if existing_booking:
                return Response(
                    {"error": "Room is already booked for these dates"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate total price
            nights = (check_out - check_in).days
            total_price = room.price_per_night * nights

            # Create booking
            booking = Booking.objects.create(
                user=request.user,
                room=room,
                check_in_date=check_in,
                check_out_date=check_out,
                total_price=total_price,
                status='pending'
            )

            serializer = BookingSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, booking_id, *args, **kwargs):
        try:
            # Get the booking and verify it belongs to the user
            booking = Booking.objects.get(id=booking_id, user=request.user)
            
            # Check if the booking can be cancelled (e.g., not already cancelled)
            if booking.status == 'cancelled':
                return Response(
                    {"error": "Booking is already cancelled"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update booking status to cancelled instead of deleting
            booking.status = 'cancelled'
            booking.save()
            
            return Response(
                {"message": "Booking cancelled successfully"},
                status=status.HTTP_200_OK
            )
            
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or you don't have permission to cancel it"},
                status=status.HTTP_404_NOT_FOUND
            )