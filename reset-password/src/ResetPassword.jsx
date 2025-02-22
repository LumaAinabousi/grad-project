import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./assets/styles";
import Grid from "@mui/material/Grid2";
function ResetPassword() {
  const { uid, token } = useParams(); // Extract both `uid` and `token` from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that both passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Make the POST request to reset password
      const response = await fetch(
        `http://127.0.0.1:8000/reset-password/${uid}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            new_password: password, // Send `new_password` as per backend API expectations
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password has been successfully updated.");
        setSuccess(true);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <Grid container spacing={2} style={styles.bg}>
      <Grid size={{ xs: 1, md: 3 }}></Grid>
      <Grid size={{ xs: 10, md: 6 }}>
        <div style={styles.container}>
          <h2 style={styles.header}>Reset Your Password</h2>
          {success && <p style={styles.message}>{message}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div>
              <Grid container spacing={2}>
                <Grid size={{ xs: 0.5, md: 1 }}></Grid>
                <Grid size={{ xs: 11, md: 10 }}>
                  {" "}
                  <label style={styles.label}>New Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Grid>
                <Grid size={{ xs: 0.5, md: 1 }}></Grid>
              </Grid>
            </div>
            <div>
              <Grid container spacing={0}>
                <Grid size={{ xs: 0.5, md: 1, lg: 1 }}></Grid>
                <Grid size={{ xs: 11, md: 10, lg: 10 }}>
                  {" "}
                  <label style={styles.label}>Confirm New Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Grid>
                <Grid size={{ xs: 0.5, md: 1, lg: 1 }}></Grid>
              </Grid>
            </div>
            <Grid container spacing={0}>
              <Grid size={{ xs: 0.5, md: 1, lg: 1 }}></Grid>
              <Grid size={{ xs: 11, md: 10, lg: 10 }}>
                <button type="submit" style={styles.button}>
                  Reset Password
                </button>
              </Grid>
              <Grid size={{ xs: 0.5, md: 1, lg: 1 }}></Grid>
            </Grid>
          </form>
          {!success && <p style={styles.error}>{message}</p>}
        </div>
      </Grid>
      <Grid size={{ xs: 10, md: 3 }}></Grid>
    </Grid>
  );
}

export default ResetPassword;
