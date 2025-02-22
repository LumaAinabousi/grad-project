from rest_framework.test import APITestCase
from rest_framework import status
from .models import *
from auth_api.models import User, Patient, Endocrinologist
from blood_glucose_records.models import BGReading
from django.utils import timezone

class ExerciseLogPatientViewTest(APITestCase):

    def setUp(self):
        self.endo_user = User.objects.create_user(
            username="endo1",
            phone_number="1111111111",
            national_number="11111",
            password="password",
            user_type="endocrinologist"
        )
        self.endocrinologist = Endocrinologist.objects.create(
            user=self.endo_user,
            clinic_address="Test Clinic"
        )
        
        self.patient_user = User.objects.create_user(
            username="patient1",
            phone_number="2222222222",
            national_number="22222",
            password="password",
            user_type="patient"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            diabetes_type="Type 1",
            gender="Male",
            supervisor=self.endocrinologist
        )

        ExerciseLog.objects.create(exercise_type='Running', duration=30, calories_burned=300, patient=self.patient, log_time='2024-12-31T12:00:00Z')
        ExerciseLog.objects.create(exercise_type='Walking', duration=45, calories_burned=150, patient=self.patient, log_time='2024-12-31T12:00:00Z')

        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']

        self.bg_reading = BGReading.objects.create(
            patient=self.patient,
            test_type='fasting',
            test_result=120.5,
            test_time='2024-12-31T12:00:00Z'
        )
        
#testcase1: POST (with BGreading)
    def test_post_exercise_log(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "bg_reading": self.bg_reading.id,
            "log_time": "2024-12-31 03:00:00 PM",
            "exercise_type": "Cycling",
            "duration": 60,
            "calories_burned": 500,
        }
        response = self.client.post('/exercise-log/', data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['exercise_type'], data['exercise_type'])
        self.assertEqual(response.data['duration'], data['duration'])
        self.assertEqual(response.data['calories_burned'], data['calories_burned'])

#testcase2: GET all exercise logs by auth. patient
    def test_get_all_by_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/exercise-log/')  

        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0) 
        self.assertEqual(response.data[0]['exercise_type'], 'Running')  

#testcase3: GET an exercise log by id by auth. patient
    def test_get_by_id(self):
        log = ExerciseLog.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/exercise-log/{log.id}/')  
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['exercise_type'], log.exercise_type)
        self.assertEqual(response.data['id'], log.id)

#testcase 4: GET an exercise log by id by another patient (non auth.)
    def test_get_forbidden_for_other_patient(self):
        other_patient_user = User.objects.create_user(
            username="patient2",
            phone_number="3333333333",
            national_number="33333",
            password="password",
            user_type="patient"
        )
        other_patient = Patient.objects.create(
            user=other_patient_user,
            diabetes_type="Type 2",
            gender="Female",
            supervisor=self.endocrinologist
        )
            
        ExerciseLog.objects.create(exercise_type='Swimming', duration=40, calories_burned=350, patient=other_patient, log_time='2024-12-31T12:00:00Z')

        log = ExerciseLog.objects.last()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/exercise-log/{log.id}/')  

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'You do not have permission to access this log')

#testcase5: PUT patient trying to edit their records
    def test_update_exercise_log(self):
        log = ExerciseLog.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        updated_data = {
            "log_time": "2024-12-31 03:00:00 PM",
            "exercise_type": "Jogging",
            "duration": 50,
            "calories_burned": 400
        }
        response = self.client.put(f'/exercise-log/{log.id}/', updated_data, format='json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['exercise_type'], updated_data['exercise_type'])
        self.assertEqual(response.data['duration'], updated_data['duration'])
        self.assertEqual(response.data['calories_burned'], updated_data['calories_burned'])

#testcase 6: trying to update another patient's exercise log
    def test_update_forbidden_for_other_patient(self):
        other_patient_user = User.objects.create_user(
            username="patient2",
            phone_number="3333333333",
            national_number="33333",
            password="password",
            user_type="patient"
        )
        other_patient = Patient.objects.create(
            user=other_patient_user,
            diabetes_type="Type 2",
            gender="Female",
            supervisor=self.endocrinologist
        )
        log = ExerciseLog.objects.create(
            exercise_type='Swimming',
            duration=30,
            calories_burned=300,
            patient=other_patient,
            log_time='2024-12-31T12:00:00Z'
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        updated_data = {
            "exercise_type": "Cycling",
            "duration": 60,
            "calories_burned": 500
        }
        response = self.client.put(f'/exercise-log/{log.id}/', updated_data, format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Data not found')

# Note: In the next tests, there's no need to test non-auth. access since we tested it on ExerciseLog; 
# as all log views inherit the same behavior of the genric view

class FoodLogPatientViewTest(APITestCase):

    def setUp(self):
        # Set up the same users, endocrinologists, and patients as in the previous test case
        self.endo_user = User.objects.create_user(
            username="endo1",
            phone_number="1111111111",
            national_number="11111",
            password="password",
            user_type="endocrinologist"
        )
        self.endocrinologist = Endocrinologist.objects.create(
            user=self.endo_user,
            clinic_address="Test Clinic"
        )
        
        self.patient_user = User.objects.create_user(
            username="patient1",
            phone_number="2222222222",
            national_number="22222",
            password="password",
            user_type="patient"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            diabetes_type="Type 1",
            gender="Male",
            supervisor=self.endocrinologist
        )

        FoodLog.objects.create(
            food_name='Apple', serving_size=1,calories=15.2, fat=0.3, protein=0.5, fiber=2.5, carbs=25, sugar=19, patient=self.patient, log_time='2024-12-31T12:00:00Z'
        )

        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']

#testcase1: POST (FoodLog)
    def test_post_food_log(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "food_name": "Banana",
            "meal_type": "Breakfast",
            "calories": 20,
            "serving_size": 1,
            "fat": 0.3,
            "protein": 1.3,
            "fiber": 3.0,
            "carbs": 27,
            "sugar": 14,
            "log_time": "2024-12-31 03:00:00 PM"
        }
        response = self.client.post('/food-log/', data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['food_name'], data['food_name'])
        self.assertEqual(response.data['serving_size'], data['serving_size'])
        self.assertEqual(response.data['carbs'], data['carbs'])

#testcase2: GET all (FoodLog)
    def test_get_all_food_logs_by_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/food-log/')

        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]['food_name'], 'Apple')

#testcase3: GET a food log by id by auth. patient
    def test_get_by_id(self):
        log = FoodLog.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/food-log/{log.id}/')  
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], log.id)

class MedicationLogPatientViewTest(APITestCase):

    def setUp(self):
        self.endo_user = User.objects.create_user(
            username="endo1",
            phone_number="1111111111",
            national_number="11111",
            password="password",
            user_type="endocrinologist"
        )
        self.endocrinologist = Endocrinologist.objects.create(
            user=self.endo_user,
            clinic_address="Test Clinic"
        )
        
        self.patient_user = User.objects.create_user(
            username="patient1",
            phone_number="2222222222",
            national_number="22222",
            password="password",
            user_type="patient"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            diabetes_type="Type 1",
            gender="Male",
            supervisor=self.endocrinologist
        )

        MedicationLog.objects.create(
            medication_name='Metformin', dosage_value=500, dosage_unit='mg', patient=self.patient, log_time='2024-12-31T12:00:00Z'
        )

        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']

#testcase1: POST (MedicationLog)
    def test_post_medication_log(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "medication_name": "Insulin",
            "dosage_value": 20,
            "dosage_unit": "units",
            "log_time": "2024-12-31 03:00:00 PM"
        }
        response = self.client.post('/medication-log/', data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['medication_name'], data['medication_name'])
        self.assertEqual(response.data['dosage_value'], data['dosage_value'])
        self.assertEqual(response.data['dosage_unit'], data['dosage_unit'])

#testcase2: GET all (MedicationLog)
    def test_get_all_medication_logs_by_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/medication-log/')

        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]['medication_name'], 'Metformin')

#testcase3: GET a medication log by id by auth. patient
    def test_get_by_id(self):
        log = MedicationLog.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/medication-log/{log.id}/')  
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], log.id)

class BloodPressureLogPatientViewTest(APITestCase):

    def setUp(self):
        self.endo_user = User.objects.create_user(
            username="endo1",
            phone_number="1111111111",
            national_number="11111",
            password="password",
            user_type="endocrinologist"
        )
        self.endocrinologist = Endocrinologist.objects.create(
            user=self.endo_user,
            clinic_address="Test Clinic"
        )
        
        self.patient_user = User.objects.create_user(
            username="patient1",
            phone_number="2222222222",
            national_number="22222",
            password="password",
            user_type="patient"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            diabetes_type="Type 1",
            gender="Male",
            supervisor=self.endocrinologist
        )

        BloodPressureLog.objects.create(
            s_pressure=120, d_pressure=80, bp_test_type='active', patient=self.patient, log_time='2024-12-31T12:00:00Z'
        )

        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']

#testcase1: POST (BloodPressureLog)
    def test_post_blood_pressure_log(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "s_pressure": 125,
            "d_pressure": 85,
            "bp_test_type": "resting",
            "log_time": "2024-12-31 03:00:00 PM"
        }
        response = self.client.post('/bp-log/', data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['s_pressure'], data['s_pressure'])


#testcase2: GET all (BloodPressureLog)
    def test_get_all_blood_pressure_logs_by_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/bp-log/')

        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]['s_pressure'], 120)

#testcase3: GET a blood pressure log by id by auth. patient
    def test_get_by_id(self):
        log = BloodPressureLog.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/bp-log/{log.id}/')  
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], log.id)