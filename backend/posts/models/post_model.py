from django.db import models
from users.models import UserModel

class PostModel(models.Model):

    class Meta:
        ordering = ["-created_at"]

    created_at = models.DateField(auto_now_add=True)
    author = models.ForeignKey(UserModel, related_name="posts", on_delete=models.CASCADE)
    post_body = models.CharField(
        blank=False,
        null=False,
        max_length=500
    )
    likes = models.ManyToManyField(
        UserModel,
        related_name="liked_posts",
        blank=True
    )


class PostFilesModel(models.Model):
    post = models.ForeignKey(PostModel, related_name="medias", on_delete=models.CASCADE)
    file = models.FileField(upload_to='posts_media/')
    order = models.PositiveIntegerField(default=0)


class CommentPostModel(models.Model):
    post = models.ForeignKey(PostModel, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(UserModel, related_name="comments", on_delete=models.CASCADE)
    body = models.TextField(
        blank=False,
        null=False,
        max_length=800
    )
    created_at = models.DateField(auto_now_add=True)