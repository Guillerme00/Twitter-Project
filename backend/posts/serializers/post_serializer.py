from rest_framework import serializers
from posts.models import PostModel
from users.serializers import UserSerializer
from .retweet_serializer import RetweetSerializer
from .postfile_serializer import PostFilesSerializer
from posts.models import PostFilesModel

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    medias = PostFilesSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()

    class Meta:
        model = PostModel
        fields = ["id", "author", "post_body", "medias", "likes", "likes_count","comments_count","created_at"]
        read_only_fields = ["created_at", "author"]

class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    retweets_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    author = UserSerializer(read_only=True)
    retweets = RetweetSerializer(many=True, read_only=True)
    medias = PostFilesSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    def get_retweets_count(self, obj):
        return obj.retweets.count()

    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()

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