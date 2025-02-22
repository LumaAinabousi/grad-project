from django.shortcuts import render
from backend.utils.functions import *
from backend.utils.views import GenericLogPatientView
from .serializers import *
from  .models import *

class FoodLogPatientView(GenericLogPatientView):
    model = FoodLog
    serializer_class = FoodLogSerializer

class ExerciseLogPatientView(GenericLogPatientView):
    serializer_class = ExerciseLogSerializer
    model = ExerciseLog

class MedicationLogPatientView(GenericLogPatientView):
    serializer_class = MedicationLogSerializer
    model = MedicationLog

class BPLogPatientView(GenericLogPatientView):
    serializer_class = BPLogSerializer
    model = BloodPressureLog