import React from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Register = (prop: {setValue: React.Dispatch<React.SetStateAction<string>>}) => {
  const [username, setUsername] = React.useState<string>("");
  const [usernameCheck, setUsernameCheck] = React.useState<boolean>(true);
  const [usernameReg, setUsernameReg] = React.useState<boolean>(true);

  const [email, setEmail] = React.useState<string>("");
  const [emailCheck, setEmailCheck] = React.useState<boolean>(true);
  const [emailReg, setEmailReg] = React.useState<boolean>(true);

  const [password, setPassword] = React.useState<string>("");
  const [passwordCheck, setPasswordCheck] = React.useState<boolean>(true);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const [comfirmPassword, setComfirmPassword] = React.useState<string>("");
  const [comfirmPasswordCheck, setComfirmPasswordCheck] =
    React.useState<boolean>(true);
  const [showComfirmPassword, setShowComfirmPassword] =
    React.useState<boolean>(false);

  const [firstName, setFirstName] = React.useState<string>("");
  const [firstNameValidate, setFirstNameValidate] =
    React.useState<boolean>(true);

  const [lastName, setLastName] = React.useState<string>("");
  const [lastNameValidate, setLastNameValidate] = React.useState<boolean>(true);

  const [sameLang, setSameLang] = React.useState<boolean>(true);

  const [tel, setTel] = React.useState<string>("");
  const [telValidate, setTelValidate] = React.useState<boolean>(true);

  const[isRegister,setIsRegister] = React.useState<boolean>(false);

  const onBlurUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userData = {
      username: event.target.value,
    };
    const reg = new RegExp("^[a-zA-Z0-9_]{6,}$");
    if (reg.test(userData.username)) {
      setUsernameReg(true);
      sendToBackend(userData);
    } else {
      setUsernameReg(false);
    }
  };

  const onBlurEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userData = {
      email: event.target.value,
    };
    const emailRegExp = new RegExp(
      "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$"
    );
    if (emailRegExp.test(userData.email)) {
      setEmailReg(true);
      sendToBackend(userData);
    } else {
      setEmailReg(false);
    }
  };

  const sendToBackend = (jsonData: { username?: string; email?: string }) => {
    let api = "http://localhost:3001";
    if (jsonData.hasOwnProperty("username")) {
      api = api + "/checkinguser";
    } else if (jsonData.hasOwnProperty("email")) {
      api = api + "/checkingemail";
    }
    console.log(api);
    axios
      .post(api, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.same == false) {
          if (response.data.username) {
            setUsernameCheck(false);

          } else if (response.data.email) {
            setEmailCheck(false);
          }
        } else {
          if (response.data.username) {
            setUsernameCheck(true);
          } else if (response.data.email) {
            setEmailCheck(true);
          }
        }
      });
  };

  const validatePassword = (event: React.FocusEvent<HTMLInputElement>) => {
    const regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (regExp.test(event.target.value)) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };
  const handleClickShowComfirmPassword = () => {
    setShowComfirmPassword(!showComfirmPassword);
  };
  const handleMouseDownComfirmPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const checkLang = (event: React.ChangeEvent<HTMLInputElement>) => {
    const thaiRegExp = /^[ก-๏เ-๙]+$/;
    const englishRegExp = /^[a-zA-Z]+$/;

    let isFirstNameThai = thaiRegExp.test(event.target.value);
    let isFirstNameEnglish = englishRegExp.test(event.target.value);
    let isLastNameThai = thaiRegExp.test(event.target.value);
    let isLastNameEnglish = englishRegExp.test(event.target.value);

    switch (event.target.id) {
      case "firstName":
        if (isFirstNameThai) {
          setFirstNameValidate(true);
        } else if (isFirstNameEnglish) {
          setFirstNameValidate(true);
        } else {
          setFirstNameValidate(false);
        }
        break;
      case "lastName":
        if (isLastNameThai) {
          setLastNameValidate(true);
        } else if (isLastNameEnglish) {
          setLastNameValidate(true);
        } else {
          setLastNameValidate(false);
        }
        break;
    }
    if (thaiRegExp.test(firstName) && thaiRegExp.test(lastName)) {
      setSameLang(true);
    } else if (englishRegExp.test(firstName) && englishRegExp.test(lastName)) {
      setSameLang(true);
    } else {
      setSameLang(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const url = "http://localhost:3001";
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("username") == "") {
      setUsernameCheck(false);
    }
    if (data.get("email") == "") {
      setEmailCheck(false);
    }
    if (data.get("password") == "" || data.get("password") == null) {
      setPasswordCheck(false);
    }
    if (data.get("comfirmPassword") == "" || data.get("comfirmPassword") == null) {
      setComfirmPasswordCheck(false);
    }
    if (data.get("firstName") == "") {
      setFirstNameValidate(false);
    }
    if (data.get("lastName") == "") {
      setLastNameValidate(false);
    }
    console.log(data.get("tel"));
    if (data.get("tel") == "") {
      setTelValidate(false);
    }
    if (
      usernameCheck &&
      emailCheck &&
      passwordCheck &&
      comfirmPasswordCheck &&
      firstNameValidate &&
      lastNameValidate &&
      telValidate
    ) {
      const userData = {
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        tel: tel,
      };
      fetch(url + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
         setIsRegister(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  if(isRegister){
    prop.setValue("1");
    return <Navigate to="/login" />
  }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "green" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          สมัครสมาชิก
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                error={!usernameCheck || !usernameReg}
                helperText={
                  username == "" && usernameCheck == false
                    ? "กรุณากรอก Username"
                    : "" || !usernameCheck
                      ? "Username นี้มีผู้ใช้งานแล้ว"
                      : "" || !usernameReg
                        ? "ต้องมีอักษร 6 ตัวขึ้นไป"
                        : ""
                }
                onChange={(event) => setUsername(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlurUsername(event)
                }
                placeholder="ห้ามเป็นภาษาไทย และอักขระพิเศษ"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                error={!emailCheck || !emailReg}
                helperText={
                  email == "" && emailCheck == false
                    ? "กรุณากรอก Email"
                    : "" || !emailCheck
                      ? "Email นี้มีผู้ใช้งานแล้ว"
                      : "" || !emailReg
                        ? "กรุณากรอก Email ให้ถูกต้อง"
                        : ""
                }
                onChange={(event) => setEmail(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlurEmail(event)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(event) => setPassword(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  validatePassword(event)
                }
                error={!passwordCheck}
                fullWidth
                helperText={
                  (password == "" || password == null) && passwordCheck == false
                    ? "กรุณากรอกรหัสผ่าน"
                    : "" || !passwordCheck
                      ? "ต้องมีตัวอักษร 8 ตัวขึ้นไป และมีตัวเลขอย่างน้อย 1 ตัว"
                      : ""
                }
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(event) => setComfirmPassword(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                  if (event.target.value != password) {
                    setComfirmPasswordCheck(false);
                  } else {
                    setComfirmPasswordCheck(true);
                  }
                }}
                error={!comfirmPasswordCheck}
                fullWidth
                helperText={
                  (comfirmPassword == "" || comfirmPassword == null) && comfirmPasswordCheck == false
                    ? "กรุณายืนยันรหัสผ่าน"
                    : "" || !comfirmPasswordCheck
                      ? "รหัสผ่านไม่ตรงกัน"
                      : ""
                }
                id="comfirmPassword"
                required
                label="ยืนยันรหัสผ่าน"
                variant="outlined"
                type={showComfirmPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle comfirm password visibility"
                        onClick={handleClickShowComfirmPassword}
                        onMouseDown={handleMouseDownComfirmPassword}
                      >
                        {showComfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={(event) => setFirstName(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  checkLang(event)
                }
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="ชื่อ"
                error={!firstNameValidate || !sameLang}
                helperText={
                  firstName == "" && firstNameValidate == false
                    ? "กรุณากรอกชื่อ"
                    : "" || !firstNameValidate
                      ? "ชื่อต้องเป็นภาษาไทย หรือ ภาษาอังกฤษ"
                      : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={(event) => setLastName(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  checkLang(event)
                }
                required
                fullWidth
                id="lastName"
                label="นามสกุล"
                name="lastName"
                autoComplete="family-name"
                error={!lastNameValidate || !sameLang}
                helperText={
                  lastName == "" && lastNameValidate == false
                    ? "กรุณากรอกนามสกุล"
                    : "" || !lastNameValidate
                      ? "นามสกุลต้องเป็นภาษาไทย หรือ ภาษาอังกฤษ"
                      : "" || !sameLang
                        ? "ชื่อและนามสกุลต้องเป็นภาษาเดียวกัน"
                        : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(event) => setTel(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                  const telRegExp = /^[0-9]{10}$/;
                  if (telRegExp.test(event.target.value)) {
                    setTelValidate(true);
                  } else {
                    setTelValidate(false);
                  }
                }}
                required
                fullWidth
                name="tel"
                label="เบอร์โทรศัพท์"
                id="tel"
                autoComplete="tel"
                error={!telValidate}
                helperText={
                  tel == "" && telValidate == false
                    ? "กรุณากรอกเบอร์โทรศัพท์"
                    : "" || !telValidate
                      ? "เบอร์โทรศัพท์ไม่ถูกต้อง"
                      : ""
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: "#fff" }}
          >
            ยืนยัน
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
