from rest_framework import serializers
from posts.models import RetweetModel
class RetweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetweetModel
        fields = "__all__"