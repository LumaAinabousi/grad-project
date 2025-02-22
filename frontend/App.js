import WelcomeScreen from "./assets/screens/WelcomeScreen";

// Register Folder
import ForgetPassScreen from "./assets/screens/Register/ForgetPassScreen";
import LoadingScreen from "./assets/screens/Register/LoadingScreen";
import DiabetesTypeScreen from "./assets/screens/Register/DiabetesTypesScreen";
import MedicalInfoPatientScreen from "./assets/screens/Register/MedicalInfoPatientScreen";
import OnBoardingScreens from "./assets/screens/Register/OnBoardingScreens";
import SignInScreen from "./assets/screens/Register/SignInScreen";
import SignUpScreen from "./assets/screens/Register/SignUpScreen";
import StartScreen from "./assets/screens/Register/StartScreen";

// Patient Folder
import HomeScreen from "./assets/screens/Patient/HomeScreen";
import ConnectionsScreen from "./assets/screens/Patient/Connections/ConnectionsScreen";
import PendingConnectionScreen from "./assets/screens/Patient/Connections/PendingConnectionScreen";
import EndoInformationScreen from "./assets/screens/Patient/Connections/EndoInformationScreen";
import ReportsScreen from "./assets/screens/Patient/Reports/ReportsScreen";
import ReportDetailsScreen from "./assets/screens/Patient/Reports/ReportDetailsScreen";
import ProfileScreen from "./assets/screens/Patient/Profile/ProfileScreen";
import EditMedicalProfileScreen from "./assets/screens/Patient/Profile/EditMedicalProfileScreen";
import EditPersonalProfileScreen from "./assets/screens/Patient/Profile/EditPersonalProfileScreen";
import AddBloodSugarScreen from "./assets/screens/Patient/BloodSugarLog/AddBloodSugarScreen";
import ViewBloodSugarScreen from "./assets/screens/Patient/BloodSugarLog/ViewBloodSugarScreen";
import AddActivityScreen from "./assets/screens/Patient/ActivityLog/AddActivityScreen";
import ViewActivityScreen from "./assets/screens/Patient/ActivityLog/ViewActivityScreen";
import EditActivityScreen from "./assets/screens/Patient/ActivityLog/EditActivityScreen";
import AddMedicationScreen from "./assets/screens/Patient/MedicationLog/AddMedicationScreen";
import ViewMedicationScreen from "./assets/screens/Patient/MedicationLog/ViewMedicationScreen";
import EditMedicationScreen from "./assets/screens/Patient/MedicationLog/EditMedicationScreen";
import AddBloodPressureScreen from "./assets/screens/Patient/BloodPressureLog/AddBloodPressureScreen";
import ViewBloodPressureScreen from "./assets/screens/Patient/BloodPressureLog/ViewBloodPressureScreen";
import AddFoodScreen from "./assets/screens/Patient/FoodLog/AddFoodScreen";
import ViewFoodScreen from "./assets/screens/Patient/FoodLog/ViewFoodScreen";
import EditFoodScreen from "./assets/screens/Patient/FoodLog/EditFoodScreen";

//Endo Folder
import EndoHomeScreen from "./assets/screens/Endocrinologist/EndoHomeScreen";
import EndoConnectionScreen from "./assets/screens/Endocrinologist/EndoConnectionScreen";
import EndoProfileScreen from "./assets/screens/Endocrinologist/EndoProfile/EndoProfileScreen";
import EndoEditProfileScreen from "./assets/screens/Endocrinologist/EndoProfile/EndoEditProfileScreen";
import PatientInfoScreen from "./assets/screens/Endocrinologist/PatientLogs/PatientInfoScreen";
import EndoViewMedicationScreen from "./assets/screens/Endocrinologist/PatientLogs/EndoViewMedicationScreen";
import EndoViewActivityScreen from "./assets/screens/Endocrinologist/PatientLogs/EndoViewActivityScreen";
import EndoViewBloodSugarScreen from "./assets/screens/Endocrinologist/PatientLogs/EndoViewBloodSugarScreen";
import EndoViewBloodPressureScreen from "./assets/screens/Endocrinologist/PatientLogs/EndoViewBloodPressureScreen";
import EndoViewFoodScreen from "./assets/screens/Endocrinologist/PatientLogs/EndoViewFoodScreen";
import EndoReportsScreen from "./assets/screens/Endocrinologist/PatientLogs/EndoReportsScreen";

import Footer from "./assets/components/Footer";
import FooterEndo from "./assets/components/FooterEndo";
import Logo from "./assets/components/Logo";
import styles from "./assets/styles";

import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function App() {
  const Stack = createStackNavigator();
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Start");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const footerVisibleScreens = [
    "Home",
    "Connections",
    "Reports",
    "Profile",
    "PendingConnection",
    "EndoInformation",
  ];
  const footerEndoVisibleScreens = [
    "EndoHome",
    "EndoConnection",
    "EndoProfile",
    "PatientInfo",
    "EndoViewMedication",
    "EndoViewActivity",
    "EndoViewBloodSugar",
    "EndoViewBloodPressure",
    "EndoViewFood",
    "EndoReports",
  ];

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const route = state?.routes[state.index];
        setCurrentRoute(route?.name ?? "Start");
      }}
    >
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="OnBoarding"
          component={OnBoardingScreens}
          options={{
            headerTitle: "Welcome to Sugarak !",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="Sugarak"
          component={StartScreen}
          options={{
            headerTitle: " ",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
          }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            headerTitle: "Sign In Page",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="ForgetPass"
          component={ForgetPassScreen}
          options={{
            headerTitle: "Reset Password",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            headerTitle: "Sign Up Page",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="DiabetesType"
          component={DiabetesTypeScreen}
          options={{
            headerTitle: "Diabetes Types",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="MedicalInfoPatient"
          component={MedicalInfoPatientScreen}
          options={{
            headerTitle: "Medical Information",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            // headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerTitle: "Welcome",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "Main Page",
            headerStyle: styles.headerStyle,
            headerTitleStyle: [
              styles.headerTitleStyle,
              { fontSize: 22, textAlign: "center" },
            ],
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Connections"
          component={ConnectionsScreen}
          options={{
            headerTitle: "Connections",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="PendingConnection"
          component={PendingConnectionScreen}
          options={{
            headerTitle: "Connections",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="EndoInformation"
          component={EndoInformationScreen}
          options={{
            headerTitle: "Connections",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            headerTitle: "Reports",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="ReportDetails"
          component={ReportDetailsScreen}
          options={{
            headerTitle: "Report Details",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerTitle: "Profile",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="EditMedicalProfile"
          component={EditMedicalProfileScreen}
          options={{
            headerTitle: "Medical Profile",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EditPersonalProfile"
          component={EditPersonalProfileScreen}
          options={{
            headerTitle: "Personal Profile",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="AddBloodSugar"
          component={AddBloodSugarScreen}
          options={{
            headerTitle: "Add Blood Sugar Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="ViewBloodSugar"
          component={ViewBloodSugarScreen}
          options={{
            headerTitle: "Blood Sugar Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="AddBloodPressure"
          component={AddBloodPressureScreen}
          options={{
            headerTitle: "Add Blood Pressure Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="ViewBloodPressure"
          component={ViewBloodPressureScreen}
          options={{
            headerTitle: "Blood Pressure Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="AddFood"
          component={AddFoodScreen}
          options={{
            headerTitle: "Add Food Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="ViewFood"
          component={ViewFoodScreen}
          options={{
            headerTitle: "Food Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EditFood"
          component={EditFoodScreen}
          options={{
            headerTitle: "Edit Food Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="AddActivity"
          component={AddActivityScreen}
          options={{
            headerTitle: "Add Activity Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="ViewActivity"
          component={ViewActivityScreen}
          options={{
            headerTitle: "Activity Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EditActivity"
          component={EditActivityScreen}
          options={{
            headerTitle: "Edit Activity Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
          options={{
            headerTitle: "Add Medication Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="ViewMedication"
          component={ViewMedicationScreen}
          options={{
            headerTitle: "Medication Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EditMedication"
          component={EditMedicationScreen}
          options={{
            headerTitle: "Edit Medication Log",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EndoHome"
          component={EndoHomeScreen}
          options={{
            headerTitle: "Main Page",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="EndoConnection"
          component={EndoConnectionScreen}
          options={{
            headerTitle: "Connection Page",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="EndoProfile"
          component={EndoProfileScreen}
          options={{
            headerTitle: "Profile Page",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="EndoEditProfile"
          component={EndoEditProfileScreen}
          options={{
            headerTitle: "Profile",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="PatientInfo"
          component={PatientInfoScreen}
          options={{
            headerTitle: "Patient Information",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EndoViewBloodSugar"
          component={EndoViewBloodSugarScreen}
          options={{
            headerTitle: "Blood Sugar Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EndoViewBloodPressure"
          component={EndoViewBloodPressureScreen}
          options={{
            headerTitle: "Blood Pressure Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />

        <Stack.Screen
          name="EndoViewActivity"
          component={EndoViewActivityScreen}
          options={{
            headerTitle: "Activity Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EndoViewFood"
          component={EndoViewFoodScreen}
          options={{
            headerTitle: "Food Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EndoViewMedication"
          component={EndoViewMedicationScreen}
          options={{
            headerTitle: "Medication Logs",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
        <Stack.Screen
          name="EndoReports"
          component={EndoReportsScreen}
          options={{
            headerTitle: "Reports",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerRight: () => <Logo />,
          }}
        />
      </Stack.Navigator>

      {footerVisibleScreens.includes(currentRoute) && <Footer />}
      {footerEndoVisibleScreens.includes(currentRoute) && <FooterEndo />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
