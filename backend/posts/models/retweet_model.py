from django.db import models
from users.models import UserModel
from posts.models import PostModel

class RetweetModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="retweets")
    post = models.ForeignKey(PostModel, on_delete=models.CASCADE, related_name="retweets")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["author", "post"], name="unique_retweet")
        ]