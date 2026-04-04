from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from django.urls import path

router = DefaultRouter()

router.register(r'users', UserViewSet)

urlpatterns = [
    #viewset
    *router.urls,

    #login
]