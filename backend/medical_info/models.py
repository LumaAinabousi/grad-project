from django.db import models
from auth_api.models import *

class MedicalInfo(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_info")
    creation_date = models.DateTimeField(auto_now_add=True) 
    kft = models.FloatField(null=True, blank=True)
    lft = models.FloatField(null=True, blank=True)
    bmi = models.FloatField()
    waist_size = models.FloatField()
    weight = models.FloatField()
    height = models.FloatField()

    @property
    def year(self):
        return self.creation_date.year
    

class HbA1cTable(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="HbA1c") 
    year = models.PositiveIntegerField()
    q1 = models.FloatField()
    q2 = models.FloatField()
    q3 = models.FloatField()
    q4 = models.FloatField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['patient', 'year'], name='unique_patient_year')
        ]

    def __str__(self):
        return f"{self.patient} - {self.year}"
