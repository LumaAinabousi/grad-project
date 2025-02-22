const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Full viewport height
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: "500px", // Limit the width of the form
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    paddingTop: "12px",
    paddingBottom: "12px",

    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    backgroundColor: "#FFF",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#C2E0F5",
    border: "none",
    borderRadius: "5px",
    color: "#000",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
  message: {
    marginBottom: "10px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#28a745",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    fontSize: "16px",
    color: "#333",
  },
  bg: {
    backgroundColor: "#f4f7fc",
  },
};

export default styles;
