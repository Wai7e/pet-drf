# Hotel Booking API Documentation

## Аутентификация

### Регистрация нового пользователя
```http
POST /api/v1/users/register/
```
Тело запроса:
```json
{
    "username": "string",
    "password": "string",
    "password2": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "phone_number": "string"
}
```

### Получение токенов
```http
POST /api/v1/token/
```
Тело запроса:
```json
{
    "username": "string",
    "password": "string"
}
```
Ответ:
```json
{
    "access": "string",
    "refresh": "string"
}
```

### Обновление токена
```http
POST /api/v1/token/refresh/
```
Тело запроса:
```json
{
    "refresh": "string"
}
```

## Номера (Rooms)

### Получение списка всех доступных номеров
```http
GET /api/v1/rooms/
```
Ответ:
```json
{
    "rooms": [
        {
            "room_name": "string",
            "room_number": "string",
            "room_type": "string",
            "price_per_nigt": "decimal",
            "capacity": "integer",
            "descripton": "string",
            "photo": "string",
            "is_available": "boolean"
        }
    ]
}
```

### Получение информации о конкретном номере
```http
GET /api/v1/rooms/{room_id}/
```
Ответ:
```json
{
    "room": {
        "room_name": "string",
        "room_number": "string",
        "room_type": "string",
        "price_per_nigt": "decimal",
        "capacity": "integer",
        "descripton": "string",
        "photo": "string",
        "is_available": "boolean"
    },
    "photos": [
        {
            "id": "integer",
            "image": "string",
            "uploaded_at": "datetime"
        }
    ]
}
```

### Поиск доступных номеров на даты
```http
POST /api/v1/rooms/available/
```
Тело запроса:
```json
{
    "check_in_date": "YYYY-MM-DD",
    "check_out_date": "YYYY-MM-DD"
}
```
Ответ:
```json
{
    "available_rooms": [
        {
            "room_name": "string",
            "room_number": "string",
            "room_type": "string",
            "price_per_nigt": "decimal",
            "capacity": "integer",
            "descripton": "string",
            "photo": "string",
            "is_available": "boolean"
        }
    ],
    "check_in_date": "YYYY-MM-DD",
    "check_out_date": "YYYY-MM-DD"
}
```

## Профиль пользователя

### Получение информации о профиле
```http
GET /api/v1/users/profile/
```
Требуется аутентификация: Bearer token
Ответ:
```json
{
    "id": "integer",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "phone_number": "string"
}
```

### Обновление профиля
```http
PUT /api/v1/users/profile/
```
Требуется аутентификация: Bearer token
Тело запроса:
```json
{
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "phone_number": "string"
}
```

## Бронирования

### Получение списка бронирований пользователя
```http
GET /api/v1/users/bookings/
```
Требуется аутентификация: Bearer token
Ответ:
```json
[
    {
        "user_id": "integer",
        "room_id": "integer",
        "check_in_date": "YYYY-MM-DD",
        "check_out_date": "YYYY-MM-DD",
        "total_price": "decimal",
        "status": "string",
        "created_at": "datetime"
    }
]
```

### Создание нового бронирования
```http
POST /api/v1/users/bookings/
```
Требуется аутентификация: Bearer token
Тело запроса:
```json
{
    "room_id": "integer",
    "check_in_date": "YYYY-MM-DD",
    "check_out_date": "YYYY-MM-DD"
}
```
Ответ:
```json
{
    "user_id": "integer",
    "room_id": "integer",
    "check_in_date": "YYYY-MM-DD",
    "check_out_date": "YYYY-MM-DD",
    "total_price": "decimal",
    "status": "pending",
    "created_at": "datetime"
}
```

### Отмена бронирования
```http
DELETE /api/v1/users/bookings/{booking_id}/
```
Требуется аутентификация: Bearer token
Ответ:
```json
{
    "message": "Booking cancelled successfully"
}
```

## Коды ответов

- 200 OK - Успешный запрос
- 201 Created - Успешное создание
- 400 Bad Request - Неверный запрос
- 401 Unauthorized - Требуется аутентификация
- 403 Forbidden - Нет доступа
- 404 Not Found - Ресурс не найден

## Примечания

1. Все запросы к защищенным эндпоинтам должны содержать заголовок:
```
Authorization: Bearer <access_token>
```

2. Для работы с медиа-файлами (фотографии) используется базовый URL:
```
http://your-domain/media/
```

3. Даты должны быть в формате YYYY-MM-DD

4. Статусы бронирования:
- pending - Ожидает подтверждения
- confirmed - Подтверждено
- cancelled - Отменено 