from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from posts.models import PostModel, RetweetModel
from posts.serializers import FeedSerializer
from django.db.models import Q

class FeedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        feed_type = request.query_params.get("feed", "for_you")
        user = request.user
        posts = None
        if feed_type == "following":
            following_users = user.following.all()
            following_ids = following_users.values_list("id", flat=True)

            retweeted_posts_ids = RetweetModel.objects.filter(
                author__id__in=following_ids
            ).values_list("post_id", flat=True)

            posts = PostModel.objects.filter(
                Q(author__in=following_users) |
                Q(id__in=retweeted_posts_ids)
                ).distinct().order_by("-created_at")
            
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