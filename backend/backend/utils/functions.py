from auth_api.models import *
from rest_framework.response import Response
from rest_framework import status

#authenticate haha
def get_patient_records_if_authorized(user, patient_id, model):
    try:
        endo_user = Endocrinologist.objects.get(user=user)
        patient = Patient.objects.get(pk=patient_id, supervisor=endo_user, status='Approved')
        return model.objects.filter(patient=patient)
    except Endocrinologist.DoesNotExist:
            return None
    except Patient.DoesNotExist:
            return None

def get_user_related_data(user):
    """
    A helper function to fetch data for either a patient or a doctor (endocrinologist) after checking if a user exists 
    """
    if user.user_type == 'patient':
        try:
            return Patient.objects.get(user=user)
        except Patient.DoesNotExist:
            return None
    elif user.user_type == 'endocrinologist':
        try:
            return Endocrinologist.objects.get(user=user)
        except Endocrinologist.DoesNotExist:
            return None
    return None  
