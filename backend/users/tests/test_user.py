import pytest
from django.core.exceptions import ValidationError
from users.factories.user_factory import UserFactory
from users.serializers import UserSerializer

def test_following(db):
    user1 = UserFactory()
    user2 = UserFactory()

    assert not user1.is_following(user2)
    user1.follow(user2)
    assert user1.is_following(user2)


def test_unfollowing(db):
    user1 = UserFactory()
    user2 = UserFactory()

    user1.follow(user2)
    assert user1.is_following(user2)
    user1.unfollow(user2)
    assert not user1.is_following(user2)



def test_dont_follow_yourself(db):
    user1 = UserFactory()

    assert not user1.follow(user1)


def test_follow_someone_twice(db):
    user1 = UserFactory()
    user2 = UserFactory()

    assert user1.follow(user2)
    assert not user1.follow(user2)

def test_write_more_than_allowed(db):
    long_name = "0" * 121
    user = UserFactory.build(name=long_name)

    with pytest.raises(ValidationError):
        user.full_clean()

def test_serializer_user_name_validation(db):
    data = {
        'name': "guilherme",
        'user_name': "guilherme00",
        'birthday': '2000-01-01'
    }

    serializer = UserSerializer(data=data)
    assert serializer.is_valid()

def test_serializer_user_name_validation_with_wrong_user_name(db):
    data = {
        'name': "guilherme",
        'user_name': "guilherme 00",
        'birthday': '2000-01-01'
    }

    serializer = UserSerializer(data=data)
    assert not serializer.is_valid()
    assert "user_name" in serializer.errors