from rest_framework.test import APITestCase
from rest_framework import status
from .models import BGReading
from auth_api.models import User, Patient, Endocrinologist

class BGReadingPatientViewTest(APITestCase):
    
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

        BGReading.objects.create(test_type='Fasting', test_result=120, test_time='2024-12-31T12:00:00Z', patient=self.patient)
        BGReading.objects.create(test_type='Fasting', test_result=140, test_time='2024-12-31T10:00:00Z', patient=self.patient)

        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']
#testcase1: patient POST bg reading       
    def test_post_bg_reading(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "test_type": "Random",
            "test_result": 135,
            "test_time": "2024-12-31 03:00:00 PM"
        }
        response = self.client.post('/bg-reading/', data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['test_type'], data['test_type'])
        self.assertEqual(response.data['test_result'], data['test_result'])
        self.assertEqual(response.data['test_time'], data['test_time'])

#testcase2: GET all bg readings by auth. patient
    def test_get_all_by_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/bg-reading/')  

        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0) 
        self.assertEqual(response.data[0]['test_result'], 120)  

#testcase3: GET a bg reading by id by auth. patient
    def test_get_by_id(self):
        reading = BGReading.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/bg-reading/{reading.id}/')  
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['test_result'], reading.test_result)
        self.assertEqual(response.data['id'], reading.id)

#testcase4: GET a bg reading by id by ANOTHER patient (non auth.)
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
        BGReading.objects.create(test_type='Fasting', test_result=110, test_time='2024-12-31T08:00:00Z', patient=other_patient)

        reading = BGReading.objects.last()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get(f'/bg-reading/{reading.id}/')  

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'You do not have permission to access this log')

#testcase 5: PUT patient trying to edit their records 
    def test_update_bg_reading(self):
        reading = BGReading.objects.first()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        updated_data = {
            "test_type": "Fasting",
            "test_time": "2024-12-31 06:00:00 PM"
        }
        response = self.client.put(f'/bg-reading/{reading.id}/', updated_data, format='json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['test_type'], updated_data['test_type'])
        self.assertEqual(response.data['test_time'], updated_data['test_time'])

#testcase 6: trying to update another patient records
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
        reading = BGReading.objects.create(
            test_type='Fasting',
            test_result=110,
            test_time='2024-12-31T08:00:00Z',
            patient=other_patient
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        updated_data = {
            "test_type": "Random",
            "test_result": 150,
            "test_time": "2024-12-31T20:00:00Z"
        }
        response = self.client.put(f'/bg-reading/{reading.id}/', updated_data, format='json')

        self.assertEqual(response.status_code, 404) 
        self.assertEqual(response.data['error'], 'Data not found')
