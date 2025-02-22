from rest_framework import serializers
from .models import *
from auth_api.models import Patient

class MedicalInfoSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())       

    class Meta:
        model = MedicalInfo
        fields = ['id', 'patient', 'creation_date', 'kft', 'lft', 'bmi', 'waist_size', 'weight', 'height']
        read_only_fields = ('creation_date',)

class HbA1cTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = HbA1cTable
        fields = ['patient', 'year', 'q1', 'q2', 'q3', 'q4']
