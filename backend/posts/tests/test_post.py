import pytest
from django.core.exceptions import ValidationError
from users.factories.user_factory import UserFactory
from posts.factories.post_factory import PostFactory
from posts.serializers import PostSerializer
from rest_framework.test import APIClient

def test_like_post(db):
    user1 = UserFactory()
    post = PostFactory()


    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/{post.pk}/like_unlike_post/")
    assert response.status_code == 200
    assert response.data["status"] == "liked"

def test_unlike_post(db):
    user1 = UserFactory()
    post = PostFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/{post.pk}/like_unlike_post/")
    response = client.post(f"/api/posts/{post.pk}/like_unlike_post/")
    assert response.status_code == 200
    assert response.data["status"] == "unliked"

def test_comment_in_a_post(db):
    user1 = UserFactory()
    post = PostFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/{post.pk}/comment/", {"body": "Hello World"}, format="json")
    
    assert response.status_code == 200
    assert response.data["status"] == "commented"