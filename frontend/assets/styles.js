import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width; // here

const styles = StyleSheet.create({
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
  textBold: {
    fontWeight: "bold",
  },
  textItalic: {
    fontStyle: "italic",
  },
  textUnderline: {
    textDecorationLine: "underline",
  },
  textCenter: {
    textAlign: "center",
  },

  loadingcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C2E0F5",
  },
  loadinglogo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  headerStyle: {
    backgroundColor: "#C2E0F5",
    height: 110,
  },
  headerTitleStyle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  typeDescriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  typeDescriptionText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },

  onboardingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    width: screenWidth,
  },
  onboardingImage: {
    width: 300,
    height: 300,
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 10,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  onboardingDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  onboardingButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  onboardingButton: {
    padding: 10,
    width: "80%",
    backgroundColor: "#C2E0F5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  onboardingWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingBottom: 50, //herew
  },
  scrollView: {
    flex: 1,
  },
  paginationWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cccccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000000",
  },

  pickerContainer: {
    borderWidth: 1.5,
    borderColor: "gray",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  picker: {
    color: "#333",
    // height: 50,
    borderColor: "gray",
    borderWidth: 1.5,
    borderRadius: 5,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  inputContainer: {
    // marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1.5,
    paddingHorizontal: 5,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 5,
  },
  radio: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#C2E0F5",
  },
  button: {
    backgroundColor: "#C2E0F5",
    paddingVertical: 12,
    borderRadius: 8,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  whitebutton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 50,
    color: "#333",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 7.5,
    marginLeft: 5,
    fontSize: 12,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },

  headerContainer: {
    padding: 10,
  },
  greeting: {
    marginHorizontal: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2.5,
  },
  subText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },

  logSection: {
    padding: 15,
  },
  progressSection: {
    padding: 15,
  },

  progressContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    // marginBottom: 10,
    marginTop: 10,
    // marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressValue: {
    fontSize: 12,
    color: "gray",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginTop: 5,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#C2E0F5",
    borderRadius: 3,
  },

  entryContainer: {
    backgroundColor: "#E8F4F8",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  entryValue: {
    fontSize: 16,
    color: "#7C7C7C",
    textAlign: "center",
    marginBottom: 10,
  },

  buttonPrimary: {
    backgroundColor: "#C2E0F5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: 100,
    borderWidth: 1,
    borderColor: "#fff",
    marginVertical: 1,
  },
  backgroundPrimary: {
    backgroundColor: "#f2f9ff",
  },
  backgroundSecondary: {
    backgroundColor: "#e0f7fa",
  },

  iconContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recordContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 5,
    marginBottom: 10,
  },

  emptyMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    borderColor: "#C2E0F5",
    borderWidth: 1,
    marginBottom: 10,
  },

  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
    paddingBottom: 5,
    textAlign: "center",
  },

  row: {
    flexDirection: "row", // Align items in a row
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: "45%", // Fixed width for labels
    textAlign: "left",
  },

  value: {
    fontSize: 16,
    color: "#666",
    flex: 1, // Take remaining space
  },

  profilePicture: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#C2E0F5",
    overflow: "hidden",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  mealItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 5,
  },
  selectedMealItem: {
    backgroundColor: "#e0f7fa",
    borderColor: "#00796b",
  },
  mealText: {
    fontSize: 16,
    color: "#333",
  },
  selectedMealText: {
    fontWeight: "bold",
    color: "#00796b",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  totalCalories: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  foodItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  reportContainer: {
    padding: 10,
    backgroundColor: "#E7F2FB",
    borderWidth: 1,
    borderColor: "#000",
    margin: 10,
  },
  reportHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  reportId: {
    fontSize: 20,
    fontWeight: "bold",
  },
  shareIcon: {
    position: "absolute",
    right: 20,
    top: 5,
    width: 20,
    height: 20,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoColumn: {
    flex: 1,
  },
  sectionTitle: {
    textAlign: "center",
    fontWeight: "bold",
    // marginBottom: 10,
  },
  infoText: {
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555",
  },
  graphSection: {
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    paddingTop: 10,
    borderRadius: 10,
  },
  chartStyle: {
    borderRadius: 10,
    // margin: 5,
  },
  footerText: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 2,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: "#000",
    marginVertical: 2,
  },
  nonEditableInput: {
    backgroundColor: "#e0e0e0",
  },
  patientItem: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  patientName: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  okButton: {
    backgroundColor: "#C2E0F5",
  },
  modalButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
// "#C2E0F5",
// "#E8F4F8",
