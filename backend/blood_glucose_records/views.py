from django.shortcuts import render
from backend.utils.functions import *
from auth_api.models import *
from blood_glucose_records.models import *
from .serializers import *
from backend.utils.views import GenericLogPatientView

class BGReadingPatientView(GenericLogPatientView):
    model = BGReading
    serializer_class = BGReadingSerializer

# class BGReadingPatientView(APIView):
#     permission_classes=[IsAuthenticated]

#     def get(self, request, id=None):
#         user = request.user
#         related_data = get_user_related_data(user)
        
#         if not related_data:
#             return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

#         if id:
#             try:
#                 bg_reading = BGReading.objects.get(id=id)

#                 if bg_reading.patient != user.patient:
#                     return Response({"error": "You do not have permission to access this BG reading."}, status=status.HTTP_403_FORBIDDEN)
    
#                 serializer = BGReadingSerializer(bg_reading)
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             except BGReading.DoesNotExist:
#                 return Response({"detail": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
#         else:  
#             bg_readings = BGReading.objects.filter(patient=user.patient)

#             serializer = BGReadingSerializer(bg_readings, many=True)
#             return Response(serializer.data)
    
#     def post(self, request):
#         user = request.user
#         related_data = get_user_related_data(user)

#         if not related_data or not isinstance(related_data, Patient):
#             return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

#         data = request.data
#         data['patient'] = related_data.user_id
        
#         serializer = BGReadingSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, id=None):
#         user = request.user
#         related_data = get_user_related_data(user)

#         if not related_data or not isinstance(related_data, Patient):
#             return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

#         if not id:
#             return Response({"error": "BG reading ID is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             bg_reading = BGReading.objects.get(id=id, patient=related_data)
#         #Note: i dont want the other patient to know if there is info or not, just give him not found with no extra details
#         except BGReading.DoesNotExist:
#             return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

#         serializer = BGReadingSerializer(bg_reading, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # # endo accessing 
# # class BGReadingEndoView(APIView):
# #     permission_classes=[IsAuthenticated]

#     def get(self, request):
#         try: 