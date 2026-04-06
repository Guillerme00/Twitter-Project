from rest_framework import serializers
from posts.models import PostModel

class PostSerializer(serializers.Serializer):
    likes_cont = serializers.SerializerMethodField()

    def get_likes_count(self, obj):
        return obj.likes.count()

    def validate_post_not_none(self, value):
        if len(value) <= 0:
            raise serializers.ValidationError("You can't do a blank post")
        return value

    class Meta:
        model = PostModel
        fields = "__all__"
        read_only = ["created_at", "author"]
        write_only = ["likes"]