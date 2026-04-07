import pytest
from django.core.exceptions import ValidationError
from users.factories.user_factory import UserFactory
from posts.factories.post_factory import PostFactory
from rest_framework.test import APIClient

def test_dont_allow_a_1200_post(db):
    long_post = "o" * 1201
    post = PostFactory.build(post_body=long_post)

    with pytest.raises(ValidationError):
        post.full_clean()

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

def test_dont_allow_comment_exced_max(db):
    user1 = UserFactory()
    post = UserFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/{post.pk}/comment/",{ "body": "0"*501}, format="json")

    assert response.erros
