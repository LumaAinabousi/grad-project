from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from logs.models import *
from logs.serializers import *
from blood_glucose_records.models import *
from blood_glucose_records.serializers import * 
from medical_info.models import *
from medical_info.serializers import * 
from backend.utils.functions import *
from django.db.models import Avg
from auth_api.serializers import EndoPatientsSerializer

# class LogsByTypeEndoView(APIView):
#     permission_classes = [IsAuthenticated]

#     log_types = {
#         'food-log': (FoodLog, FoodLogSerializer),
#         'medication-log': (MedicationLog, MedicationLogSerializer),
#         'exercise-log': (ExerciseLog, ExerciseLogSerializer),
#         'bp-log': (BloodPressureLog, BPLogSerializer),
#         'bg-reading': (BGReading, BGReadingSerializer),
#         'medical-info': (MedicalInfo, MedicalInfoSerializer),
#     }

#     def get(self, request, patient_id, log_type, log_id=None):

#         if log_type not in self.log_types:
#             return Response(
#                 {"error": f"Invalid log type. Available types: {', '.join(self.log_types.keys())}"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         model, serializer_class = self.log_types[log_type]
#         logs = get_patient_records_if_authorized(request.user, patient_id, model)

#         if logs is None:
#             return Response(
#                 {"error": "You are not authorized to view logs for this patient"},
#                 status=status.HTTP_403_FORBIDDEN
#             )
            
#         if log_id:
#             try:
#                 log = BGReading.objects.get(pk=log_id)  
#                 if not log:
#                     return Response({"detail": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

#                 serializer = serializer_class(log)  
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             except model.DoesNotExist:
#                 return Response({"detail": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
            
#         else:
        
#             serializer = serializer_class(logs, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

class LogsByTypeEndoView(APIView):
    permission_classes = [IsAuthenticated]

    log_types = {
        'food-log': (FoodLog, FoodLogSerializer),
        'medication-log': (MedicationLog, MedicationLogSerializer),
        'exercise-log': (ExerciseLog, ExerciseLogSerializer),
        'bp-log': (BloodPressureLog, BPLogSerializer),
        'bg-reading': (BGReading, BGReadingSerializer),
        'medical-info': (MedicalInfo, MedicalInfoSerializer),
    }

    def get(self, request, patient_id, log_type, log_id=None):
        print('meow u hit')
        if log_type not in self.log_types:
            print('c1')
            return Response(
                {"error": f"Invalid log type. Available types: {', '.join(self.log_types.keys())}"},
                
                status=status.HTTP_400_BAD_REQUEST
            )


        model, serializer_class = self.log_types[log_type]
        logs = get_patient_records_if_authorized(request.user, patient_id, model)

        if logs is None:
            return Response(
                {"error": "You are not authorized to view logs for this patient"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if log_id:
            try:
                log = model.objects.get(pk=log_id)  # Ensure it finds the correct log
                serializer = serializer_class(log)  
                return Response(serializer.data, status=status.HTTP_200_OK)
            except model.DoesNotExist:
                print('c3')
                return Response({"detail": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
            
        else:
            serializer = serializer_class(logs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class YearlyAverageMedicalEndoView(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class = MedicalInfoSerializer

    def get(self, request, id):
        user = request.user
        related_data = get_user_related_data(user)
        if not related_data:
            return Response({"error": "You are not an endocrinologist"}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            endo_user = Endocrinologist.objects.get(user=user)
            patient = Patient.objects.get(pk=id, supervisor=endo_user, status='Approved')
            patient_records = MedicalInfo.objects.filter(patient=patient)
        except Patient.DoesNotExist:
                return Response({"error": "You are not authorized to view logs for this patient"},
                                status=status.HTTP_403_FORBIDDEN)


        one_year_ago = datetime.now() - timedelta(days=365)
        records = patient_records.filter(creation_date__gte=one_year_ago)

        if not records.exists():
            return Response({"error": "No medical info for the past year"}, status=status.HTTP_404_NOT_FOUND)
        
        # print('DEBUGG')
        # print(records.query)
        # for record in records:
        #     print(record.creation_date)
        averages = records.aggregate(
            avg_kft=Avg('kft'),
            avg_lft=Avg('lft'),
            avg_bmi=Avg('bmi'),
            avg_waist_size=Avg('waist_size'),
            avg_weight=Avg('weight'),
            avg_height=Avg('height')
        )
        hba1c_record = HbA1cTable.objects.filter(patient=patient, year=datetime.now().year).first() #latest one since this is for yearly report 
        hba1c_data = [hba1c_record.q1, hba1c_record.q2, hba1c_record.q3, hba1c_record.q4] if hba1c_record else None

        avgs_and_hba1c = {
            **averages,
            "hba1c": hba1c_data
        }
        return Response(avgs_and_hba1c, status=status.HTTP_200_OK)
    
  # GET patient info for the doctor 
class GetPatientsByDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.user_type != 'endocrinologist':
            return Response({'detail': 'Permission denied. Only doctors can access this resource.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            endo = Endocrinologist.objects.get(user=request.user)
            patient_type = request.query_params.get('type', 'Approved')

            if patient_type not in ['Approved', 'Pending', 'Rejected']:
                return Response({'detail': "Invalid type. Valid options are 'Approved', 'Pending', or 'Rejected'."}, status=status.HTTP_400_BAD_REQUEST)


            patients = Patient.objects.filter(supervisor=endo, status=patient_type)

            serializer = EndoPatientsSerializer(patients, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Endocrinologist.DoesNotExist:
            return Response({'detail': 'Endocrinologist not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    