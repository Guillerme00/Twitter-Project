import factory
from users.models import UserModel

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserModel
    
    name = factory.Faker('name')
    user_name = factory.Faker('user_name')
    bio = factory.Faker('text', max_nb_chars=200)
    birthday = factory.Faker('date_of_birth', minimum_age=18, maximum_age=80)

    