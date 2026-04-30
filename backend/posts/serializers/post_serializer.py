from rest_framework import serializers
from posts.models import PostModel
from users.serializers import UserSerializer
from .comment_serializer import CommentSerializer
from .retweet_serializer import RetweetSerializer
from .postfile_serializer import PostFilesSerializer

class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    retweets = RetweetSerializer(many=True, read_only=True)
    media = PostFilesSerializer(many=True, read_only=True)

    def get_likes_count(self, obj):
        return obj.likes.count()

    def validate_post_body(self, value):
        if len(value) <= 0:
            raise serializers.ValidationError("You can't do a blank post")
        return value
    
    class Meta:
        model = PostModel
        fields = "__all__"
        read_only_fields = ["created_at", "author"]
        write_only_fields = ["likes"]