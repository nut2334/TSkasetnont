import React from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { Navigate } from "react-router-dom";
import * as config from "../../config/config";

const Forgot = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const apiForgot = config.getApiEndpoint("forgot", "POST");

  const handleSubmit = () => {
    if (typeof email !== "string" || email.trim() === "") {
      alert("กรุณากรอกอีเมล");
      return;
    }
    axios
      .post(apiForgot, {
        email: email,
      })
      .then(() => {
        setIsSubmit(true);
      });
  };
  if (isSubmit) {
    return <Navigate to="/login" />;
  }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ลืมรหัสผ่าน
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, color: "white" }}
          color="primary"
          type="submit"
        >
          ยืนยัน
        </Button>
      </Box>
    </Container>
  );
};

export default Forgot;
