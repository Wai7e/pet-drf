from django.shortcuts import render
from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer
from rest_framework import status
from rest_framework.response import Response


class RoomApiView(APIView):

    def get(self, request, *args, **kwargs):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response({"rooms": serializer.data}, status=status.HTTP_200_OK)