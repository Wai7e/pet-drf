from rest_framework import serializers
from .models import Room, RoomPhoto, User, Booking
from django.contrib.auth.password_validation import validate_password

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('room_name', 'room_number', 'room_type', 'price_per_night', 
                  'capacity', 'descripton', 'photo', 'is_available')

    room_name = serializers.CharField(max_length=20)
    room_number = serializers.CharField(max_length=10)
    room_type = serializers.CharField(max_length=50)
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=0)
    capacity = serializers.IntegerField()
    descripton = serializers.CharField()
    photo = serializers.ImageField()
    is_available = serializers.BooleanField(default=True)

class RoomPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomPhoto
        fields = ('id', 'image', 'uploaded_at')
    
    image = serializers.ImageField()
    uploaded_at = serializers.DateTimeField()


class BookingSerializer(serializers.ModelSerializer):
    room = RoomSerializer()  # Добавьте это!

    class Meta:
        model = Booking
        fields = (
            'id', 'room', 'user_id', 'check_in_date', 'check_out_date',
            'total_price', 'status', 'created_at'
        )
    
    check_in_date = serializers.DateField()
    check_out_date = serializers.DateField()
    total_price = serializers.DecimalField(max_digits=20, decimal_places=2)
    status = serializers.ChoiceField(choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ], default='pending')
    created_at = serializers.DateField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number')
        read_only_fields = ('id',)


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'phone_number')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user