from rest_framework import serializers
from .models import *
from auth_api.models import Patient
from datetime import datetime

##################################################
#helper funs:
def validate_types(value, choices):
    valid_choices = choices
    normalized_value = value.lower()
    if normalized_value not in valid_choices:
        raise serializers.ValidationError(f"Invalid test type. Must be one of {valid_choices}.")
    return normalized_value

class CustomDateTimeField(serializers.DateTimeField):
    def to_internal_value(self, value):
        try:
            return datetime.strptime(value, "%Y-%m-%d %I:%M:%S %p")
        except ValueError:
            return super().to_internal_value(value)

##################################################
# serializers    
class LogSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all()) 
    bg_reading = serializers.PrimaryKeyRelatedField(queryset=BGReading.objects.all(), required=False)
    log_time = CustomDateTimeField(format="%Y-%m-%d %I:%M:%S %p")      

    class Meta:
        model = Log
        fields = ['id', 'patient', 'bg_reading', 'log_time']

    # def create(self, validated_data):
    #     return Log.objects.create(**validated_data)

class ExerciseLogSerializer(LogSerializer):
    exercise_type = serializers.CharField(max_length=100)

    class Meta:
        model = ExerciseLog
        fields = LogSerializer.Meta.fields + ['exercise_type', 'duration', 'calories_burned']
    
        
    def create(self, validated_data):
        return ExerciseLog.objects.create(**validated_data)


class FoodLogSerializer(LogSerializer):
    meal_type = serializers.CharField(validators=[lambda value: validate_types(value, ['lunch', 'dinner','breakfast','snack'])])

    class Meta:
        model = FoodLog
        fields = LogSerializer.Meta.fields + ['food_name','calories', 'serving_size', 'meal_type', 'fat', 'protein', 'fiber', 'carbs', 'sugar']


    def create(self, validated_data):
        return FoodLog.objects.create(**validated_data)

class MedicationLogSerializer(LogSerializer):
    class Meta:
        model = MedicationLog
        fields = LogSerializer.Meta.fields + ['medication_name', 'dosage_value', 'dosage_unit']

    def create(self, validated_data):
        return MedicationLog.objects.create(**validated_data)


class BPLogSerializer(LogSerializer):
    bp_test_type = serializers.CharField(validators=[lambda value: validate_types(value, ['resting', 'active'])])

    class Meta:
        model = BloodPressureLog
        fields = LogSerializer.Meta.fields + ['s_pressure', 'd_pressure', 'bp_test_type']

    
    def create(self, validated_data):
        return BloodPressureLog.objects.create(**validated_data)
