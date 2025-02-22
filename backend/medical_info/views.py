from backend.utils.views import GenericLogPatientView
from medical_info.models import MedicalInfo
from medical_info.serializers import MedicalInfoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from backend.utils.functions import *
from django.db.models import Avg
from datetime import datetime, timedelta

from .models import HbA1cTable
from .serializers import HbA1cTableSerializer
from backend.utils.functions import get_user_related_data


class MedicalInfoPatientView(GenericLogPatientView):
    model = MedicalInfo
    serializer_class = MedicalInfoSerializer

    #patients can not 'edit' a yearly record. they can only POST new records.
    def put(self, request, id=None):
        return Response({"error": "Medical Info can not be edited. Please create a new one instead"},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

#return yearly average of each field for a patient (KFT, LFT, etc.. ) --yearly reports/reports
class YearlyAverageMedicalPatientView(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class = MedicalInfoSerializer

    def get(self, request):
        user = request.user
        related_data = get_user_related_data(user)
        
        if not related_data:
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        one_year_ago = datetime.now() - timedelta(days=365)
        records = MedicalInfo.objects.filter(patient=user.patient, creation_date__gte=one_year_ago)

        if not records.exists():
            return Response({"error": "No medical info for the past year"}, status=status.HTTP_404_NOT_FOUND)

        averages = records.aggregate(
            avg_kft=Avg('kft'),
            avg_lft=Avg('lft'),
            avg_bmi=Avg('bmi'),
            avg_waist_size=Avg('waist_size'),
            avg_weight=Avg('weight'),
            avg_height=Avg('height')
        )
                
        hba1c_record = HbA1cTable.objects.filter(patient=user.patient, year=datetime.now().year).first() #latest one since this is for yearly report 
        hba1c_data = [hba1c_record.q1, hba1c_record.q2, hba1c_record.q3, hba1c_record.q4] if hba1c_record else None

        avgs_and_hba1c = {
            **averages,
            "hba1c": hba1c_data
        }
        return Response(avgs_and_hba1c, status=status.HTTP_200_OK)
    


class HbA1cPatientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, year=None):
        user = request.user
        related_data = get_user_related_data(user)

        if not related_data or not isinstance(related_data, Patient):
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        if year:
            try:
                log = HbA1cTable.objects.get(patient=related_data, year=year)
                serializer = HbA1cTableSerializer(log)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except HbA1cTable.DoesNotExist:
                return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            logs = HbA1cTable.objects.filter(patient=related_data)
            serializer = HbA1cTableSerializer(logs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        related_data = get_user_related_data(user)

        if not related_data or not isinstance(related_data, Patient):
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['patient'] = related_data.user_id

        serializer = HbA1cTableSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, year=None):
        user = request.user
        related_data = get_user_related_data(user)

        if not related_data or not isinstance(related_data, Patient):
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        if not year:
            return Response({"error": "Year is required to update the log."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            log = HbA1cTable.objects.get(patient=related_data, year=year)
        except HbA1cTable.DoesNotExist:
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = HbA1cTableSerializer(log, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
