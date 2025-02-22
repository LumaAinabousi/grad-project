from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.core.exceptions import MultipleObjectsReturned
from django.db import models 
from .models import User

class UsernameOrNationalNumberBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(
                models.Q(username=username) | models.Q(national_number=username)
            )    
        except User.DoesNotExist: 
            return None 
        except MultipleObjectsReturned:
            return None 

        if user and check_password(password, user.password):
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
