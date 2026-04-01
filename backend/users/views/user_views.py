from rest_framework import viewsets
from users.models import UserModel
from users.serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer