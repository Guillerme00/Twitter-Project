from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from posts.models import PostModel
from posts.serializers import FeedSerializer
from django.db.models import Q

class FeedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        original_post = PostModel.objects.get(id=post_id)

        PostModel.objects.create(
            author=request.user,
            retweet_post=original_post
        )

        return Response(
            {"detail": "Retweeted successfully."},
            status=status.HTTP_201_CREATED
        )
    
    def get(self, request):
        feed_type = request.query_params.get("feed", "for_you")
        user = request.user
        posts = None
        if feed_type == "following":
            following_users = user.following.all()
            posts = PostModel.objects.filter(
                Q(author__in=following_users))
            
        elif feed_type == "for_you":
            posts = PostModel.objects.all().order_by("-created_at")
        else:
            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = FeedSerializer(posts, many=True, context={"request": request})
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )