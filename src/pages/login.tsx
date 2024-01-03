import React from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Avatar,
  Typography,
  Box,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [usernameReg, setUsernameReg] = React.useState(true);

  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const url = "http://localhost:3001";

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setUsername(data.get("username") as string);
    setPassword(data.get("password") as string);
    if (usernameReg) {
      const userData = {
        username: username,
        password: password,
      };
      console.log(userData);
      fetch(url + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (data.cookie) {
            
          }
          else{
            alert("Username หรือ Password ไม่ถูกต้อง");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "green" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          เข้าสู่ระบบ
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            error={!username || !usernameReg}
            helperText={
              !username
                ? "กรุณากรอก Username"
                : "" || !usernameReg
                ? "ห้ามเป็นภาษาไทย และอักขระพิเศษ"
                : ""
            }
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => {
              if (username) {
                setUsernameReg(/^[A-Za-z0-9]+$/.test(username));
              }
            }}
          />
          <TextField
            onChange={(event) => setPassword(event.target.value)}
            error={!password}
            fullWidth
            helperText={!password ? "กรุณากรอกรหัสผ่าน" : ""}
            id="password"
            required
            label="รหัสผ่าน"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="จดจำฉันไว้ในระบบ"
            />
            <NavLink
              to="/Forgot"
              style={{ textDecoration: "none", color: "green" }}
            >
              ลืมรหัสผ่าน?
            </NavLink>
          </div>
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            sx={{ mt: 3, mb: 2, color: "#fff" }}
          >
            เข้าสู่ระบบ
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
