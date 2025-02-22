from django.db import models
from auth_api.models import Patient

class BGReading(models.Model):
    TEST_TYPE_CHOICES = [
        ('fasting', 'Fasting'),
        ('random', 'Random'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="bg_readings")
    test_type = models.CharField(max_length=50, choices=TEST_TYPE_CHOICES) 
    test_result = models.FloatField() 
    test_time = models.DateTimeField() 
