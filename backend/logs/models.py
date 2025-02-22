from django.db import models
from auth_api.models import *
from blood_glucose_records.models import * 

class Log(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="%(class)s_logs") 
    bg_reading = models.ForeignKey(BGReading, null=True, blank=True, on_delete=models.SET_NULL) 
    log_time = models.DateTimeField()

    class Meta:
        abstract = True

class ExerciseLog(Log):
    exercise_type = models.CharField(max_length=100)
    duration = models.PositiveIntegerField()
    calories_burned = models.FloatField()

class FoodLog(Log):
    MEAL_TYPES_CHOICES=[
        ('lunch','Lunch'),
        ('dinner', 'Dinner'),
        ('breakfast', 'Breakfast'),
        ('snack', 'Snack'),
    ]

    food_name = models.CharField(max_length=200)
    serving_size = models.FloatField(max_length=50) #in gms
    meal_type = models.CharField(max_length=15, choices=MEAL_TYPES_CHOICES)
    calories= models.FloatField()
    fat = models.FloatField()
    protein = models.FloatField()
    fiber = models.FloatField()
    carbs = models.FloatField()
    sugar = models.FloatField()   

class MedicationLog(Log):
    medication_name = models.CharField(max_length=100)
    dosage_value = models.FloatField() 
    dosage_unit = models.CharField(max_length=20)

class BloodPressureLog(Log):
    TEST_TYPES_CHOICES=[
        ('resting','Resting'),
        ('active', 'Active'),
    ]
    s_pressure = models.FloatField()
    d_pressure = models.FloatField()
    bp_test_type = models.CharField(max_length=20, choices=TEST_TYPES_CHOICES)