from rest_framework import viewsets
from posts.models import PostModel, CommentPostModel
from rest_framework import status
from posts.serializers import PostSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class PostViewSet(viewsets.ModelViewSet):
    queryset = PostModel.objects.all()
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author == request.user:
            return super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    def get_serializer_class(self):
        if self.action in ["comment"]:
            return CommentSerializer
        return PostSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["delete"], url_path="delete_comment/(?P<comment_pk>[^/.]+)")
    def delete_comment(self, request, pk=None, comment_pk=None):
        user_want_to_delete = request.user
        try:
            comment = CommentPostModel.objects.get(pk=comment_pk, author=user_want_to_delete)
            comment.delete()
            return Response(
                {"status": "deleted"}
            )
        except CommentPostModel.DoesNotExist:
            return Response(
                {"status": 404}
            )
            
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
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            comment = serializer.save(post=post_to_comment, author = request.user)
            return Response({"status": "commented", "id": comment.id})
        return Response(serializer.errors, status=400)