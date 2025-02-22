from rest_framework.test import APITestCase
from rest_framework import status
from auth_api.models import *
from logs.models import FoodLog
from logs.serializers import FoodLogSerializer
from datetime import datetime
from medical_info.models import *
from django.utils.timezone import now, timedelta

class TestPatientLogsByTypeView(APITestCase):
    def setUp(self):
        self.endo_user1 = User.objects.create_user(
            username="endo1",
            phone_number="1111111111",
            national_number="11111",
            password="password",
            user_type="endocrinologist"
        )

        self.endocrinologist1 = Endocrinologist.objects.create(
            user=self.endo_user1,
            clinic_address="my street is empty"
        )

        self.endo_token = self.client.post('/login/', {
            'username': 'endo1',
            'password': 'password'
        }).data['access']

        self.patient = Patient.objects.create(user=User.objects.create_user(username="patient_user", password="password",phone_number="07811111111", national_number="1211111111" ),
                                              supervisor=self.endocrinologist1, status='Approved')

        self.food_log = FoodLog.objects.create(
            patient=self.patient,
            food_name="Apple",
            serving_size=1,
            calories=12,
            meal_type="snack",
            fat=0.3,
            protein=0.5,
            fiber=2.4,
            carbs=25,
            sugar=19,
            log_time=datetime.now()
        )
#testcase1: GET a patients food logs 
    def test_get_patient_food_logs(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.endo_token}")

        response = self.client.get(f'/patients/{self.patient.user_id}/logs/food-log/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Validate the response data
        serializer = FoodLogSerializer(FoodLog.objects.filter(patient=self.patient), many=True)
        self.assertEqual(response.data, serializer.data)

#testcase2: invalid type --not medical/food/etc...
    def test_get_patient_logs_invalid_type(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.endo_token}")

        response = self.client.get(f'/patients/{self.patient.user_id}/logs/invalid-log-type/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid log type", response.data['error'])

#testcase3: endo trying to access a patient not supervised by him(non auth.)
    def test_get_patient_logs_unauthorized(self):
        unsupervised_patient = Patient.objects.create(user=User.objects.create_user(username="other_patient", password="password", phone_number="07711111111", national_number="1311111111"))

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.endo_token}")

        response = self.client.get(f'/patients/{unsupervised_patient.user_id}/logs/food-log/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("You are not authorized", response.data['error'])

class YearlyAverageMedicalEndoViewTest(APITestCase):

    def setUp(self):
        self.endo_user1 = User.objects.create_user(
            username="endo1",
            phone_number="1111111111",
            national_number="11111",
            password="password",
            user_type="endocrinologist"
        )
        self.endocrinologist1 = Endocrinologist.objects.create(
            user=self.endo_user1,
            clinic_address="my street is empty"
        )

        self.endo_token = self.client.post('/login/', {
            'username': 'endo1',
            'password': 'password'
        }).data['access']

        self.patient = Patient.objects.create(user=User.objects.create_user(username="patient_user", password="password", phone_number="07811111111", national_number="1211111111"),
                                              supervisor=self.endocrinologist1, status='Approved')

        now = datetime.now()
        MedicalInfo.objects.create(patient=self.patient, kft=0.5, lft=0.6, bmi=22.0, waist_size=80, weight=70, height=180, creation_date=now)
        MedicalInfo.objects.create(patient=self.patient, kft=0.4, lft=0.5, bmi=23.0, waist_size=82, weight=72, height=180, creation_date=now - timedelta(days=200))

        m = MedicalInfo.objects.create(patient=self.patient, kft=0.3, lft=0.4, bmi=21.5, waist_size=78, weight=68, height=180)
        m.creation_date = now - timedelta(days=400)
        m.save()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.endo_token}")

    def test_yearly_averages_valid(self):
        response = self.client.get(f"/endo/medical-info/avg/{self.patient.user_id}/")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertAlmostEqual(response.data["avg_kft"], 0.45) 
        self.assertAlmostEqual(response.data["avg_lft"], 0.55)  
        self.assertAlmostEqual(response.data["avg_bmi"], 22.5)


    def test_yearly_averages_no_records(self):
        old_patient_user = User.objects.create_user(username="old_patient_user", password="password", phone_number="07911111111", national_number="1231231234")
        old_patient = Patient.objects.create(user=old_patient_user, supervisor=self.endocrinologist1, status='Approved')

        response = self.client.get(f"/endo/medical-info/avg/{old_patient.user_id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "No medical info for the past year")

    def test_yearly_averages_non_endocrinologist(self):
        non_endo_user = User.objects.create_user(username="non_endo_user", password="password", user_type="patient", phone_number='07999999999', national_number='1234123455')
        response = self.client.post("/login/", {"username": "non_endo_user", "password": "password"})
        token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(f"/endo/medical-info/avg/{self.patient.user_id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["error"], "You are not an endocrinologist")

    def test_yearly_averages_not_supervised(self):
        new_endo_user = User.objects.create_user(
            username="endo2",
            phone_number="1234567090",
            national_number="12325",
            password="password",
            user_type="endocrinologist",)
        new_endo = Endocrinologist.objects.create(user=new_endo_user)

        response = self.client.post("/login/", {"username": "endo2", "password": "password"})
        new_endo_token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {new_endo_token}")

        response = self.client.get(f"/endo/medical-info/avg/{self.patient.user_id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["error"], "You are not authorized to view logs for this patient")