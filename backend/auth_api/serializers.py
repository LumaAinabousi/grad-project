from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Patient, Endocrinologist
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail

# users
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'phone_number', 'national_number', 'first_name', 'last_name', 'email', 'user_type', 'birthdate']

class EndocrinologistSerializer(serializers.ModelSerializer):
    user = UserSerializer() 
    
    class Meta:
        model = Endocrinologist
        fields = ['user', 'clinic_address']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                print("User serializer errors:", user_serializer.errors)
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        user_data = data.pop('user')  
        return {
            **user_data,
            'clinic_address': data['clinic_address']
        }

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    supervisor = EndocrinologistSerializer()

    class Meta:
        model = Patient
        fields = ['user', 'diabetes_type', 'gender', 'supervisor', 'status']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                print("User serializer errors:", user_serializer.errors)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user_data = data.pop('user') 
        supervisor_data = data.pop('supervisor')
        
        supervisor_prefixed_data = {}
        if supervisor_data:
            for key, value in supervisor_data.items():
                supervisor_prefixed_data[f"supervisor_{key}"] = value
                
        return {
            **user_data,
            'diabetes_type': data['diabetes_type'],  
            'gender': data['gender'], 
            **supervisor_prefixed_data,
            'status':data['status']
        }
    
# endo -access-> patients    
# user info allowed to be seen by endo
class UserPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id','username', 'phone_number', 'first_name', 'last_name', 'birthdate']
   
# endo viewing patients info 
class EndoPatientsSerializer(serializers.ModelSerializer):
    user = UserPatientSerializer()  

    class Meta:
        model = Patient
        fields = ['user', 'diabetes_type', 'gender']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user_data = data.pop('user')  
        return {
            **user_data,
            'diabetes_type': data['diabetes_type'],  
            'gender': data['gender'], 
        }

# validate user-specific register info
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'phone_number', 'national_number', 'first_name', 'last_name', 'user_type', 'birthdate', 'password', 'email']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_national_number(self, value):
        if User.objects.filter(national_number=value).exists():
            raise serializers.ValidationError("A user with this national number already exists.")
        return value
    
    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
# validate user log-in info
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid login credentials")
        return {"user": user}  

# password changing / forgot password request
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return value

    def send_reset_email(self, user):
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"https://main.d2qyh0dioze278.amplifyapp.com/reset-password/{uid}/{token}"
        send_mail(
            subject="Password Reset Request",
            message=f"Click the link below to reset your password:\n{reset_link}",
            from_email="noreply@example.com",
            recipient_list=[user.email],
        )
        return reset_link
    
# reset password req
class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            raise serializers.ValidationError("Invalid token or user.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired token.")

        return data

    def save(self):
        uid = force_str(urlsafe_base64_decode(self.validated_data['uid']))
        user = User.objects.get(pk=uid)
        user.set_password(self.validated_data['new_password'])
        user.save()

# linking ser 
class LinkSupervisorSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate(self, data):
        try:
            endocrinologist = User.objects.get(username=data['username'], user_type='endocrinologist')
            data['endocrinologist'] = endocrinologist  
        except User.DoesNotExist:
            raise serializers.ValidationError("Endocrinologist with the given username does not exist.")
        return data

    def save(self, **kwargs):

        patient = kwargs.get('patient')

        endocrinologist = Endocrinologist.objects.get(user=self.validated_data['endocrinologist'])
        
                
        if patient.supervisor == endocrinologist and patient.status in ['pending', 'approved']:
            raise serializers.ValidationError("A pending or approved request already exists with this endocrinologist.")

        patient.supervisor = endocrinologist
        patient.status = 'Pending'
        patient.save()
        
        return patient
    


