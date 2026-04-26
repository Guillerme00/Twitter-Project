from rest_framework import serializers
from users.models import UserModel
from rest_framework.exceptions import ValidationError

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
    
    def create(self, validated_data):
        email = validated_data.pop('email', None)

        if not email:
            raise ValidationError({"email": "this field is required"})

        password = validated_data.pop('password', None)
        user = UserModel(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    # Classes
    class Meta:
        model = UserModel
        fields = ["id","name", "email", "username", "profile_image", "profile_banner", "bio", "followers_count", "following_count", "password", "birthday"]
        read_only_fields = ['created_at', 'id']
        extra_kwargs = {
            'password': {"write_only": True, "required":True}
        }