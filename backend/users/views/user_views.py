from rest_framework import viewsets
from users.models import UserModel
from users.serializers import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer


    #decorators
    @action(detail=True, methods=["post"])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        current_user = request.user

        if current_user == user_to_follow:
            return Response(
                {"error": "You can't follow yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if current_user.follow(user_to_follow):
            return Response({"status": "followed"})

        return Response(
            {"error": "Already following"},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=["post"])
    def unfollow(self, request, pk=None):
        current_user = request.user
        user_to_unfollow = self.get_object()

        if current_user == user_to_unfollow:
            return Response(
                {"error": "You can't unfollow yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if current_user.unfollow(user_to_unfollow):
            return Response({"status": "Unfollowed"})

        return Response(
            {"error": "You can't unfollow someone you don't follow"},
            status=status.HTTP_400_BAD_REQUEST
        )