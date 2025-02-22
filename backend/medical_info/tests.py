from rest_framework.test import APITestCase
from rest_framework import status
from medical_info.models import MedicalInfo, HbA1cTable
from auth_api.models import Patient, User, Endocrinologist
from datetime import datetime, timedelta

class MedicalInfoViewTest(APITestCase):
    def setUp(self):
        self.patient_user = User.objects.create_user(
            username="patient1",
            phone_number="1234567890",
            national_number="12345",
            password="password",
            user_type="patient",
        )
        self.patient = Patient.objects.create(
            user=self.patient_user, diabetes_type="Type 1", gender="Male"
        )

        self.medical_info = MedicalInfo.objects.create(
            patient=self.patient,
            kft=0.347,
            lft=0.89,
            bmi=22.9,
            waist_size=68,
            weight=89,
            height=182
        )

        response = self.client.post(
            "/login/",
            {"username": "patient1", "password": "password"},
        )
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
#testcase1: GET a medical record
    def test_retrieve_medical_info(self):
        response = self.client.get(f"/medical-info/{self.medical_info.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["kft"], 0.347)

#testcase2: PUT (not allowed)
    def test_update_medical_info(self):
        updated_data = {
            "weight": 80,
        }
        response = self.client.put(
            f"/medical-info/{self.medical_info.id}/",
            data=updated_data,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
#testcase3: POST 
    def test_create_medical_info(self):
        new_medical_info = {
            "kft": 0.111,
            "lft": 0.222,
            "bmi": 22.6,
            "waist_size": 88,
            "weight": 90,
            "height": 182
        }
        response = self.client.post("/medical-info/", data=new_medical_info, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["kft"], 0.111)

#testcase3: GET non-auth. 
    def test_unauthorized_access(self):
        self.client.credentials() 
        response = self.client.get(f"/medical-info/{self.medical_info.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Authentication credentials were not provided.", str(response.data))



class YearlyAverageMedicalPatientView(APITestCase):
    def setUp(self):
        self.patient_user = User.objects.create_user(
            username="patient1",
            phone_number="1234567890",
            national_number="12345",
            password="password",
            user_type="patient",
        )
        self.patient = Patient.objects.create(
            user=self.patient_user, diabetes_type="Type 1", gender="Male"
        )

        now = datetime.now()
        MedicalInfo.objects.create(patient=self.patient, kft=0.5, lft=0.6, bmi=22.0, waist_size=80, weight=70, height=180, creation_date=now)
        MedicalInfo.objects.create(patient=self.patient, kft=0.4, lft=0.5, bmi=23.0, waist_size=82, weight=72, height=180, creation_date=now - timedelta(days=200))
        
        m = MedicalInfo.objects.create(patient=self.patient, kft=0.3, lft=0.4, bmi=21.5, waist_size=78, weight=68, height=180)
        m.creation_date = now - timedelta(days=400)
        m.save()

        response = self.client.post("/login/", {
            "username": "patient1",
            "password": "password"
            })
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_yearly_averages(self):
        response = self.client.get("/medical-info/avg/")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertAlmostEqual(response.data["avg_kft"], 0.45)  
        self.assertAlmostEqual(response.data["avg_lft"], 0.55)
        self.assertAlmostEqual(response.data["avg_bmi"], 22.5)
    
    def test_unauth_access(self):
        self.client.credentials()
        response = self.client.get(f"/medical-info/avg/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



class HbA1cPatientViewTest(APITestCase):
    
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

        HbA1cTable.objects.create(patient=self.patient, year=2024, q1=5.4, q2=5.5, q3=5.6, q4=5.7)
        HbA1cTable.objects.create(patient=self.patient, year=2025, q1=5.2, q2=5.3, q3=5.4, q4=5.5)

        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']

    def test_get_all_hba1c_logs(self):
        """
        Test retrieving all HbA1c logs for the authenticated patient
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/hba1c/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_hba1c_log_by_year(self):
        """
        Test retrieving a specific HbA1c log by year
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/hba1c/2024/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['year'], 2024)
        self.assertAlmostEqual(response.data['q1'], 5.4)

    def test_post_hba1c_log(self):
        """
        Test creating a new HbA1c log for the authenticated patient
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "year": 2026,
            "q1": 5.8,
            "q2": 5.9,
            "q3": 6.0,
            "q4": 6.1
        }
        response = self.client.post('/hba1c/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['year'], 2026)
        self.assertAlmostEqual(response.data['q1'], 5.8)

    def test_put_hba1c_log(self):
        """
        Test updating an existing HbA1c log for a specific year
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        data = {
            "q1": 6.2,
            "q4": 6.5
        }
        response = self.client.put('/hba1c/2024/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertAlmostEqual(response.data['q1'], 6.2)
        self.assertAlmostEqual(response.data['q4'], 6.5)

    def test_get_hba1c_log_not_found(self):
        """
        Test retrieving a non existent HbA1c log returns 404
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/hba1c/2030/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access(self):
        """
        Test unauthenticated access is denied
        """
        response = self.client.get('/hba1c/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
