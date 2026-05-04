from rest_framework import serializers
from posts.models import PostModel
from users.serializers import UserSerializer
from .comment_serializer import CommentSerializer
from .retweet_serializer import RetweetSerializer
from .postfile_serializer import PostFilesSerializer
from posts.models import PostFilesModel

class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    retweets = RetweetSerializer(many=True, read_only=True)
    medias = PostFilesSerializer(many=True, read_only=True)
    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    def get_likes_count(self, obj):
        return obj.likes.count()

    def validate_post_body(self, value):
        if len(value) <= 0:
            raise serializers.ValidationError("You can't do a blank post")
        return value
    
    
    def create(self, validated_data):
        files = validated_data.pop("files", [])
        validated_data.pop("likes", None)

        post = PostModel.objects.create(
            **validated_data
        )

        for index, file in enumerate(files):
            PostFilesModel.objects.create(
                post=post,
                file=file,
                order=index
            )

        return post

    class Meta:
        model = PostModel
        fields = "__all__"
        read_only_fields = ["created_at", "author"]
        write_only_fields = ["likes"]