from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, username, phone_number, national_number, password=None, **extra_fields):
        if not username or not phone_number or not national_number:
            raise ValueError("Username, phone number and national number are all required.")
        user = self.model(username=username, phone_number=phone_number, national_number=national_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, phone_number, national_number, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, phone_number, national_number, password, **extra_fields)

#################################
# User model:
# unique identifier for the user is username.
class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    national_number = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=30)
    USER_TYPE_CHOICES = [
        ('patient', 'Patient'),
        ('endocrinologist', 'Endocrinologist'),
    ]
    user_type = models.CharField(max_length=15, choices=USER_TYPE_CHOICES)
    birthdate = models.DateField(default=None,null=True)
    
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = ['phone_number', 'national_number']

    def __str__(self):
        return self.username


#################################
# Endocrinologist model:
class Endocrinologist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    clinic_address = models.TextField()  

#################################
# Patient model:
class Patient(models.Model):
    STATUS_FIELD_OPTIONS=[
        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    diabetes_type = models.CharField(max_length=10)
    gender = models.CharField(max_length=10)
    supervisor = models.ForeignKey(Endocrinologist, on_delete=models.SET_NULL, null=True, blank=True, related_name="patients")
    status = models.CharField(max_length=15, choices=STATUS_FIELD_OPTIONS, blank=True)

# #################################
# # BG reading model:
# class BGReading(models.Model):
#     test_type = models.CharField()

# ##################################
# # Logs model:
# class Logs(models.Model):
    
