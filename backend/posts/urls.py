from rest_framework.routers import DefaultRouter
from posts.views import PostViewSet
from django.urls import path

router = DefaultRouter()

router.register(r"posts", PostViewSet)

urlpatterns = [
    *router.urls,
]