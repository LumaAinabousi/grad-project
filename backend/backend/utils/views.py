from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from backend.utils.functions import *
from auth_api.models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

class GenericLogPatientView(APIView):
    permission_classes=[IsAuthenticated]
    """
    Generic view for handling CRUD operations on patient logs (medications, exercise, BG, BP, food, medicalInfo)
    """
    model = None
    serializer_class = None

    def get(self, request, id=None):
        user = request.user
        related_data = get_user_related_data(user)
        
        if not related_data:
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        if id:
            try:
                log = self.model.objects.get(id=id)

                if log.patient != user.patient:
                    return Response({"error": "You do not have permission to access this log"}, status=status.HTTP_403_FORBIDDEN) #heere
    
                serializer = self.serializer_class(log)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except self.model.DoesNotExist:
                return Response({"detail": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
        else:  
            logs = self.model.objects.filter(patient=user.patient)

            serializer = self.serializer_class(logs, many=True)
            return Response(serializer.data)
    
    def post(self, request):
        user = request.user
        related_data = get_user_related_data(user)

        if not related_data or not isinstance(related_data, Patient):
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        data['patient'] = related_data.user_id
        
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        user = request.user
        related_data = get_user_related_data(user)

        if not related_data or not isinstance(related_data, Patient):
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        if not id:
            return Response({"error": "Log ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            log = self.model.objects.get(id=id, patient=related_data)
        #Note: i dont want the other patient to know if there is info or not, just give him not found with no extra details
        except self.model.DoesNotExist:
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(log, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
