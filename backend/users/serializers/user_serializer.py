from rest_framework import serializers
from users.models import UserModel

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()


    # Defs
    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()
    
    def validate_username(self, value):
        if ' ' in value:
            raise serializers.ValidationError("The username cannot contain spaces.")
        return value

    # Classes
    class Meta:
        model = UserModel
        fields = "__all__"
        read_only_fields = ['created_at', 'id']