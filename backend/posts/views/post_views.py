from rest_framework import viewsets
from posts.models import PostModel, CommentPostModel
from posts.serializers import PostSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

class PostViewSet(viewsets.ModelViewSet):
    queryset = PostModel.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    @action(detail=True, methods=["post"])
    def like_unlike_post(self, request, pk=None):
        post_to_like = self.get_object()
        user_who_liked = request.user

        if post_to_like.likes.filter(pk=user_who_liked.pk):
            post_to_like.likes.remove(user_who_liked)
            return Response(
                {"status": "unliked"}
            )
        else:
            post_to_like.likes.add(user_who_liked)
            return Response(
                {"status": "liked"}
            )
    
    @action(detail=True, methods=["post"])
    def comment(self, request, pk=None):
        post_to_comment = self.get_object()
        user_to_comment = request.user
        user_comment = request.data.get("body")

        comment = CommentPostModel.objects.create(
            post = post_to_comment,
            author = user_to_comment,
            body = user_comment
        )

        return Response (
            {"status": "commented"}
        )