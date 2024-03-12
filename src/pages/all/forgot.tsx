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
import Swal from "sweetalert2";

const Forgot = () => {
  const [email, setEmail] = React.useState("");
  const [regEmail, setRegEmail] = React.useState(false);
  const [isSubmit, setIsSubmit] = React.useState(false);

  const apiForgot = config.getApiEndpoint("forgot", "POST");

  const handleSubmit = () => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
      setRegEmail(true);
      return;
    }
    axios
      .post(apiForgot, {
        email: email,
      })
      .then((response) => {
        if (response.data.email == true) {
          Swal.fire({
            title: "สำเร็จ",
            text: "กรุณาตรวจสอบอีเมลของคุณ",
            icon: "success",
            confirmButtonText: "ปิด",
          });
          setIsSubmit(true);
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            icon: "error",
            confirmButtonText: "ปิด",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "ปิด",
        });
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
          error={regEmail}
          helperText={regEmail ? "กรุณากรอกอีเมลให้ถูกต้อง" : ""}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, color: "white" }}
          color="primary"
          onClick={() => {
            handleSubmit();
          }}
        >
          ยืนยัน
        </Button>
      </Box>
    </Container>
  );
};

export default Forgot;
