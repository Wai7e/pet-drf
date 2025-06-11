from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):
    room_name = models.CharField(max_length=20, default=None, verbose_name= "название")
    room_number = models.CharField(max_length=10, verbose_name= "номер номера", unique=True)
    room_type = models.CharField(max_length=50, verbose_name= "тип комнаты")
    price_per_nigt = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="цена за ночь")
    capacity = models.PositiveBigIntegerField(verbose_name="вместимость")
    descripton = models.TextField(blank=True, verbose_name="описание")
    is_available = models.BooleanField(default=True)

class RoomPhoto(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='room_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name= "пользователь")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, verbose_name= "номер")
    check_in_date = models.DateField(blank=False, verbose_name= "дата заезда")
    check_out_date = models.DateField(blank=False, verbose_name= "дата выезда")
    total_price = models.DecimalField(max_digits=20, decimal_places=2, verbose_name="общая стоимость")
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ], default='pending', verbose_name= "статус")
    created_at = models.DateField(auto_now_add=True, verbose_name= "создано")