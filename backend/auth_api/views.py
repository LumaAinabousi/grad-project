from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login
from .serializers import RegisterSerializer, LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, LinkSupervisorSerializer, EndoPatientsSerializer, PatientSerializer, EndocrinologistSerializer
from .models import User, Patient, Endocrinologist
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

# profiles
class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # get profile info
    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    
    # edit profile info
    def put(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            updated_patient = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EndocrinologistProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # get profile info
    def get(self, request):
        try:
            endocrinologist = Endocrinologist.objects.get(user=request.user)
        except Endocrinologist.DoesNotExist:
            return Response({"error": "Endocrinologist not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EndocrinologistSerializer(endocrinologist)
        return Response(serializer.data)
    
    # edit profile info
    def put(self, request):
        try:
            endocrinologist = Endocrinologist.objects.get(user=request.user)
        except Endocrinologist.DoesNotExist:
            return Response({"error": "Endocrinologist not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EndocrinologistSerializer(endocrinologist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Register new user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if user.user_type == 'patient':
            Patient.objects.create(user=user, diabetes_type=request.data.get('diabetes_type'), gender=request.data.get('gender'))
        elif user.user_type == 'endocrinologist':
            Endocrinologist.objects.create(user=user, clinic_address=request.data.get('clinic_address'))

        refresh = RefreshToken.for_user(user)
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response(
            {
                "user": serializer.data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED)
        #return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Login 
class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if user is None:
            return Response(
                {"error": "?"},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_type": user.user_type,
        }, status=status.HTTP_200_OK)

# Change password 
class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=serializer.validated_data['email'])
        serializer.send_reset_email(user)

        return Response(
            {"message": "Password reset email sent successfully."},
            status=status.HTTP_200_OK
        )

class ResetPasswordView(APIView):
    def post(self, request, token, uid):

        data = {'token': token, **request.data, 'uid':uid} 

        serializer = ResetPasswordSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Password reset successfully."},
            status=status.HTTP_200_OK
        )

# Link patient / endo 
class LinkSupervisorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({"error": "You are not a patient."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LinkSupervisorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(patient=patient)

        return Response({"message": "Request to link supervisor sent successfully."}, status=status.HTTP_200_OK)

# Endo approve / reject
class ApproveRejectSupervisorView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, patient_id):
        if request.user.user_type != 'endocrinologist':
            return Response({'detail': 'Permission denied. Only doctors can access this resource.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            endo = Endocrinologist.objects.get(user=request.user)
            patient = Patient.objects.get(pk=patient_id)

            if patient.supervisor != endo:
                return Response({'detail': 'This patient is not supervised by you.'}, status=status.HTTP_400_BAD_REQUEST)

            action = request.data.get('action')
            if action == 'approve':
                patient.status = 'Approved'

                patient.save()
                return Response({'message': 'Supervisor request approved successfully.'}, status=status.HTTP_200_OK)

            elif action == 'reject':
                patient.status = 'Rejected'
                patient.save()
                return Response({'message': 'Supervisor request rejected successfully.'}, status=status.HTTP_200_OK)

            else:
                return Response({'detail': 'Invalid action. Only approve or reject is allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        except Endocrinologist.DoesNotExist:
            return Response({'detail': 'Endocrinologist not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Patient.DoesNotExist:
            return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)
