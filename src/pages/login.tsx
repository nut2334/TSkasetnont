import React, { useEffect,useState } from "react";
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
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Login = (prop: {
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [username, setUsername] = useState("");
  const [usernameReg, setUsernameReg] =useState(true);

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [showPassword, setShowPassword] =useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLogin] = useState(false);
  const [error,setError]= useState(false);

  const url = "http://localhost:3001";

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handelCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password == "") {
      setPasswordCheck(true);
    }
    if (username == "") {
      setUsernameReg(false);
    }
    if (usernameReg && !passwordCheck) {
      const userData = {
        username: username.trim(),
        password: password,
      };
      console.log(userData);
      axios
        .post(`${url}/login`, userData)
        .then((res) => {
          console.log(res.data);
          if (res.data.token) {
            if (rememberMe) {
              const cookies = new Cookies();
              cookies.set("jwt_token", res.data.token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 720),
              });
            }
            prop.setJwt_token(res.data.token);
            setIsLogin(true);
          }
        })
        .catch((err) => {
          setError(true);
        });
    }
  };
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
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
            error={!usernameReg || error}
            helperText={
              username == "" && usernameReg == false
                ? "กรุณากรอก Username"
                : "" || !usernameReg
                ? "ห้ามเป็นภาษาไทย และอักขระพิเศษ"
                : "" 
            }
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => {
              if (username) {
                console.log(username);
                setUsernameReg(/^[A-Za-z0-9]+$/.test(username));
              }
            }}
          />
          <TextField
            onChange={(event) => setPassword(event.target.value)}
            error={passwordCheck || error}
            fullWidth
            helperText={passwordCheck ? "กรุณากรอกรหัสผ่าน" : "" || error
            ? "Username หรือ Password ไม่ถูกต้อง"
            : ""}
            id="password"
            required
            label="Password"
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
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={handelCheckboxChange}
                />
              }
              label="จดจำฉันไว้ในระบบ"
            />
            <NavLink
              to="/forgot"
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
