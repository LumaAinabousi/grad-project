from rest_framework import serializers
from .models import BGReading
from auth_api.models import Patient
from datetime import datetime

def validate_test_type(value):
    valid_choices = ['fasting', 'random']
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
        
class BGReadingSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all()) 
    test_type = serializers.CharField(validators=[validate_test_type])
    test_time = CustomDateTimeField(format="%Y-%m-%d %I:%M:%S %p") 

    class Meta:
        model = BGReading
        fields = ['id','test_type', 'test_result', 'test_time', 'patient']


    def create(self, validated_data):
        return BGReading.objects.create(**validated_data)
