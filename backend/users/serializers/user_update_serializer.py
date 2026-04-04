from rest_framework import serializers
from users.models import UserModel

class UserUpdateSerializer(serializers.Serializer):
    class Meta:
        model = UserModel