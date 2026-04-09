from rest_framework import serializers
from posts.models import CommentPostModel

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentPostModel
        fields = "__all__"
        read_only_fields = ["author", "post", "created_at"]
    
    def validate_body(self, value):
        if len(value) > 800:
            raise serializers.ValidationError("Comment can't contain more than 800 caracters")
        if len(value) == 0:
            raise serializers.ValidationError("Comment can't be blank")
        return value