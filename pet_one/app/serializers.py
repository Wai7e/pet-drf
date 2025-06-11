from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('room_name', 'room_number', 'room_type', 'price_per_nigt', 'capacity', 'descripton')
