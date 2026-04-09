from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from ..models import PostModel, RetweetModel

class RetweetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(PostModel, pk=post_id)

        retweet = RetweetModel.objects.filter(
            author = request.user,
            post = post
        ).first()

        if retweet:
            retweet.delete()
            return Response({"retweeted": False}, status=status.HTTP_200_OK)
        
        RetweetModel.objects.create(
            author = request.user,
            post = post
        )

        return Response({"Retweeted": True}, status=status.HTTP_201_CREATED)