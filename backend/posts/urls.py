from rest_framework.routers import DefaultRouter
from posts.views import PostViewSet, RetweetView
from django.urls import path

router = DefaultRouter()

router.register(r"posts", PostViewSet)

urlpatterns = [
    *router.urls,
    path('posts/<int:post_id>/retweet/', RetweetView.as_view()),
]