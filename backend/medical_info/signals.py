# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from blood_glucose_records.models import BGReading
# from .models import MedicalInfo
# from django.db.models import Avg
# from datetime import timedelta, datetime

# @receiver(post_save, sender=BGReading)
# def update_hba1c(sender, instance, **kwargs):
#     if instance.test_type.lower() != 'fasting':
#         return  

#     try:
#         medical_info = MedicalInfo.objects.get(patient=instance.patient)
#     except MedicalInfo.DoesNotExist:
#         return  

#     current_date = datetime.now()
#     hba1c_values = []

#     for i in range(4):
#         start_date = current_date - timedelta(days=90 * (i + 1))
#         end_date = current_date - timedelta(days=90 * i)
#         readings = BGReading.objects.filter(
#             patient=instance.patient,
#             test_type='fasting',
#             timestamp__range=(start_date, end_date)
#         )

#         if readings.exists():
#             avg_fbg = readings.aggregate(avg_value=Avg('value'))['avg_value']
#             hba1c = 2.6 + 0.03 * avg_fbg
#             hba1c_values.append(hba1c)
#         else:
#             hba1c_values.append(None)

#     medical_info.hba1c = list(reversed(hba1c_values))
#     medical_info.save()
