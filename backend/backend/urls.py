"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from auth_api.views import *
from blood_glucose_records.views import *
from logs.views import *
from endo_access.views import *
from medical_info.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='change_password'),
    path('reset-password/<str:uid>/<str:token>/', ResetPasswordView.as_view(), name='reset_password'),

    path('endo/profile/', EndocrinologistProfileView.as_view(), name='endo_profile'),
    path('patient/profile/', PatientProfileView.as_view(), name='patient_profile'),

    
    path('patient/link-patient/', LinkSupervisorView.as_view(), name='link_supervisor'),
    path('endo/approve-reject-connection/<int:patient_id>/', ApproveRejectSupervisorView.as_view(), name='approve_reject_requests'),
    path('endo/get_patients/', GetPatientsByDoctorView.as_view(), name='get_patients_LIST'),


    path('bg-reading/', BGReadingPatientView.as_view(), name='bg_readings_LIST'),
    path('bg-reading/<int:id>/', BGReadingPatientView.as_view(), name='bgreading_detail'),


    path('exercise-log/', ExerciseLogPatientView.as_view(), name='exercise_log'),
    path('food-log/', FoodLogPatientView.as_view(), name='food_log'),
    path('medication-log/', MedicationLogPatientView.as_view(), name='medication_log'),
    path('bp-log/', BPLogPatientView.as_view(), name='blood_pressure_log'),

    path('exercise-log/<int:id>/', ExerciseLogPatientView.as_view(), name='exercise_log_detail'),
    path('food-log/<int:id>/', FoodLogPatientView.as_view(), name='food_log_detail'),
    path('medication-log/<int:id>/', MedicationLogPatientView.as_view(), name='medication_log_detail'),
    path('bp-log/<int:id>/', BPLogPatientView.as_view(), name='blood_pressure_detail'),

    path('patients/<int:patient_id>/logs/<str:log_type>/', LogsByTypeEndoView.as_view(), name='patient_logs_by_type'),
    path('patients/<int:patient_id>/logs/<str:log_type>/<int:log_id>/', LogsByTypeEndoView.as_view(), name='patient_logs_by_type_id'),


    path('medical-info/', MedicalInfoPatientView.as_view(), name='medical_info'),
    path('medical-info/<int:id>/', MedicalInfoPatientView.as_view(), name='medical_info'),
    path('medical-info/avg/', YearlyAverageMedicalPatientView.as_view(), name='avg_medical_info'),
    
    path('endo/medical-info/avg/<int:id>/', YearlyAverageMedicalEndoView.as_view(), name='endo-view'),

    path('hba1c/', HbA1cPatientView.as_view(), name='hba1c-list-create'),
    path('hba1c/<int:year>/', HbA1cPatientView.as_view(), name='hba1c-detail'),

]
