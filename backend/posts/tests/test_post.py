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
    post = PostFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/{post.pk}/comment/", {"body": "0"*801}, format="json")

    assert response.status_code == 400


def test_dont_allow_a_blank_post(db):
    user1 = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user1)
    
    respose = client.post(f"/api/posts/", {"post_body": ""}, format="json")

    assert respose.status_code == 400
    assert "post_body" in respose.data


def test_dont_allow_a_blank_comment(db):
    user1 = UserFactory()
    post = PostFactory()

    client = APIClient()
    client.force_authenticate(user=user1)
    
    response = client.post(f"/api/posts/{post.pk}/comment/", {"body": ""}, format="json")

    assert response.status_code == 400
    assert "body" in response.data

def test_create_post(db):
    user1 = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/", {"post_body": "0"*300}, format="json")

    assert response.status_code == 201


def test_delete_post(db):
    post = PostFactory()
    user1 = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.delete(f"/api/posts/{post.pk}/")

    assert response.status_code == 204


def test_get_posts(db):
    post = PostFactory()
    post2 = PostFactory()
    post3 = PostFactory()
    user1 = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.get(f"/api/posts/")

    assert response.status_code == 200
    assert len(response.data) == 3

def test_like_increases(db):
    post = PostFactory()
    user1 = UserFactory()
    user2 = UserFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    client2 = APIClient()
    client2.force_authenticate(user=user2)

    response1 = client.post(f"/api/posts/{post.pk}/like_unlike_post/")
    assert response1.status_code == 200
    assert response1.data == {"status": "liked"}
    assert post.likes.count() == 1

    response2 = client2.post(f"/api/posts/{post.pk}/like_unlike_post/")
    assert response2.status_code == 200
    assert response2.data == {"status": "liked"}
    assert post.likes.count() == 2

def test_retweet_a_post(db):
    user1 = UserFactory()
    post = PostFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(f"/api/posts/{post.pk}/retweet/")

    assert response.status_code == 201
    assert post.retweets.count() == 1


def test_unretweet_a_post(db):
    user1 = UserFactory()
    post = PostFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    client.post(f"/api/posts/{post.pk}/retweet/")
    response = client.post(f"/api/posts/{post.pk}/retweet/")

    assert response.status_code == 200
    assert post.retweets.count() == 0

def test_return_the_retweeted_post_from_a_user(db):
    user1 = UserFactory()
    post = PostFactory()
    post2 = PostFactory()
    post3 = PostFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    client.post(f"/api/posts/{post.pk}/retweet/")
    client.post(f"/api/posts/{post2.pk}/retweet/")
    client.post(f"/api/posts/{post3.pk}/retweet/")

    assert user1.retweets.count() == 3

def test_return_feed(db):
    user1 = UserFactory()
    post1 = PostFactory()
    post2 = PostFactory()
    post3 = PostFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.get("/api/feed/?feed=for_you")

    assert response.status_code == 200
    assert len(response.data) == 3

def test_posts_from_users_you_dont_follow_dont_appears_in_following_feed(db):
    user1 = UserFactory()
    post1 = PostFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.get("/api/feed/?feed=following")

    assert response.status_code == 200
    assert len(response.data) == 0

def test_posts_from_users_you_follow_appears_in_following_feed(db):
    user1 = UserFactory()
    user2 = UserFactory()

    client = APIClient()
    client.force_authenticate(user=user1)

    client.post(f"/api/users/{user2.pk}/follow/")

    post1 = PostFactory(author=user2)

    response = client.get("/api/feed/?feed=following")
    
    assert response.status_code == 200
    assert len(response.data) == 1


def test_retweeted_post_appears_in_following_feed(db):
    user1 = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user1)

    user2 = UserFactory()
    client2 = APIClient()
    client2.force_authenticate(user=user2)

    post1 = PostFactory()

    client.post(f"/api/users/{user2.pk}/follow/")
    client2.post(f"/api/posts/{post1.pk}/retweet/")

    response = client.get("/api/feed/?feed=following")

    assert response.status_code == 200
    assert len(response.data) == 1