from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Patient, Endocrinologist
from rest_framework_simplejwt.tokens import RefreshToken


class UserProfilesTest(APITestCase):

    def setUp(self):
        #endo
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

        #patient
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

        #login as endo + get token
        response = self.client.post('/login/', {
            "username": "endo1",
            "password": "password"
        })
        self.endo_token = response.data['access']

        #login as patient + get token
        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.patient_token = response.data['access']

#first testcase: endo trying to retrieve their info GET
    def test_get_endo(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.endo_token}")
        response = self.client.get('/endo/profile/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['clinic_address'], "Test Clinic")

#second testcase: endo trying to edit their info PUT
    def test_put_endo(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.endo_token}")

        # user specific info 
        update_data = {'user': {'first_name': 'lama'}}
        response = self.client.put('/endo/profile/', data=update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], "lama")

        # endo specific info
        update_data = {'clinic_address': 'new clinic add'}
        response = self.client.put('/endo/profile/', data=update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['clinic_address'], "new clinic add")

#third testcase: patient trying to retrieve their info GET
    def test_get_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")
        response = self.client.get('/patient/profile/')

        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['gender'], "Male")

#fourth testcase: patient trying to edit their info PUT
    def test_put_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.patient_token}")

        update_data = {'user': {'first_name': 'oz'}}
        response = self.client.put('/patient/profile/', data=update_data,  format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], "oz")

class GetPatientsByDoctorTest(APITestCase):

    def setUp(self):
        #endo
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

        #patient
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
            supervisor=self.endocrinologist,
            status='Approved'
        )

        #patient2
        self.patient_user2 = User.objects.create_user(
            username="patient2",
            phone_number="3333333333",
            national_number="33333",
            password="password",
            user_type="patient"
        )
        self.patient2 = Patient.objects.create(
            user=self.patient_user2,
            diabetes_type="Type 2",
            gender="Female"
        )

        #login as endo
        response = self.client.post('/login/', {
            "username": "endo1",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
#testcase1: auth endo trying to check HIS patients
    def test_get_patients_by_doctor_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get('/endo/get_patients/') 

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)  
        self.assertEqual(response.data[0]['username'], 'patient1')

#testcase2: non-endo user
    def test_get_patients_by_doctor_unauthorized_user(self):
        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        response = self.client.get('/endo/get_patients/') 

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'Permission denied. Only doctors can access this resource.')

#testcase3: endo has no patients 
    def test_get_patients_by_doctor_no_patients(self):
        endo_user2 = User.objects.create_user(
            username="endo2",
            phone_number="5555555555",
            national_number="55555",
            password="password",
            user_type="endocrinologist"
        )
        endo2 = Endocrinologist.objects.create(user=endo_user2, clinic_address="Another Clinic")

        response = self.client.post('/login/', {
            "username": "endo2",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        response = self.client.get('/endo/get_patients/') 

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data, [])

#testcase4: endo checking NOT HIS patient
    def test_get_patients_by_doctor_patient_not_linked(self):
        response = self.client.post('/login/', {
            "username": "endo1",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        response = self.client.get('/endo/get_patients/') 

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('patient2', [patient['username'] for patient in response.data])

class LinkAPITest(APITestCase):
    def setUp(self):
        #endo1
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
        #endo2
        self.endo_user2 = User.objects.create_user(
            username="endo2",
            phone_number="1111111112",
            national_number="11112",
            password="password",
            user_type="endocrinologist"
        )

        self.endocrinologist2 = Endocrinologist.objects.create(
            user=self.endo_user2,
            clinic_address="my street is empty"
        )
        #patient1
        self.patient_user1 = User.objects.create_user(
            username="patient1",
            phone_number="2222222222",
            national_number="22222",
            password="password",
            user_type="patient"
        )
        self.patient1 = Patient.objects.create(
            user=self.patient_user1,
            diabetes_type="Type 1",
            gender="Male"
        )

        #login to get auth detAILS 
        response = self.client.post('/login/', {
            "username": "patient1",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.link_url = "/patient/link-patient/"

#first testcase: an auth patient with an existing endo
    def test_successful_linking(self):
        #step1: patient request dr
        response = self.client.post(self.link_url, {
            "username": "endo1"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Request to link supervisor sent successfully.")

        #verify the user is now connected
        self.patient1.refresh_from_db()
        self.assertEqual(self.patient1.supervisor, self.endocrinologist1)
        self.assertEqual(self.patient1.status, 'Pending')

        #step2: endo approve the request
        response = self.client.post('/login/', {
            "username": "endo1",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")        

        response = self.client.post(f"/endo/approve-reject-connection/{self.patient1.user_id}/", {"action":'approve'})

        #NOW it should be status=approved
        self.patient1.refresh_from_db()
        self.assertEqual(self.patient1.supervisor, self.endocrinologist1)
        self.assertEqual(self.patient1.status, 'Approved')

#second testcase: an auth patient with NON EXISTENT !! endo
    def test_unsuccessful_linking_invalid_endocrinologist(self):
        response = self.client.post(self.link_url, {
            "username": "nonexistent_endo"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)  
        self.assertEqual(response.data["non_field_errors"][0], "Endocrinologist with the given username does not exist.")

#third testcase: a NON AUTH PATIENT!!
    def test_unauthenticated_request(self):
        self.client.credentials()  
        response = self.client.post(self.link_url, {
            "username": "endo1"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data) 
        self.assertEqual(response.data["detail"], "Authentication credentials were not provided.")


#last testcase: a NON PATIENT!!!!!!!!!
    def test_unauthorized_request(self):

        #login as non patient(aka admin / superuser)
        response = self.client.post('/login/', {
            "username": "endo2",
            "password": "password"
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        response = self.client.post(self.link_url, {
            "username": "endo1"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "You are not a patient.")

