import React, { useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import * as config from "../config/config";
import CreateIcon from "@mui/icons-material/Create";

const EditProfile = (prop: { jwt_token: string, admin?: { username: string, role: string } }) => {
  const apiUpdateInfo = config.getApiEndpoint("updateinfo", "POST");
  const apiRole = config.getApiEndpoint("role", "GET");
  const apiCheckinguser = config.getApiEndpoint("checkinguser", "POST");
  const apiCheckingemail = config.getApiEndpoint("checkingemail", "POST");
  const apiGetinfo = config.getApiEndpoint("getinfo", "GET");
  const apiUpdateInfoadmin = config.getApiEndpoint("updateinfoadmin", "GET");

  const [username, setUsername] = React.useState<string>("");
  const [usernameCheck, setUsernameCheck] = React.useState<boolean>(true);
  const [usernameReg, setUsernameReg] = React.useState<boolean>(true);
  const [email, setEmail] = React.useState<string>("");
  const [emailCheck, setEmailCheck] = React.useState<boolean>(true);
  const [emailReg, setEmailReg] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>("");
  const [passwordCheck, setPasswordCheck] = React.useState<boolean>(true);
  const [comfirmPassword, setComfirmPassword] = React.useState<string>("");
  const [comfirmPasswordCheck, setComfirmPasswordCheck] =
    React.useState<boolean>(true);
  const [firstName, setFirstName] = React.useState<string>("");
  const [firstNameValidate, setFirstNameValidate] =
    React.useState<boolean>(true);
  const [lastName, setLastName] = React.useState<string>("");
  const [lastNameValidate, setLastNameValidate] = React.useState<boolean>(true);
  const [sameLang, setSameLang] = React.useState<boolean>(true);
  const [tel, setTel] = React.useState<string>("");
  const [telValidate, setTelValidate] = React.useState<boolean>(true);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showComfirmPassword, setShowComfirmPassword] =
    React.useState<boolean>(false);

  const [allrole, setAllrole] = React.useState<
    [{ role_id: string; role_name: string }]
  >([{ role_id: "", role_name: "" }]);
  const [role, setRole] = React.useState<string>("");
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowComfirmPassword = () => {
    setShowComfirmPassword(!showComfirmPassword);
  };

  const handleMouseDownComfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onBlurUsername = (event: React.FocusEvent<HTMLInputElement>) => {
    axios
      .post(apiCheckinguser, {
        username: event.target.value,
      })
      .then((res) => {
        if (res.data) {
          setUsernameCheck(false);
        } else {
          setUsernameCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBlurEmail = (event: React.FocusEvent<HTMLInputElement>) => {
    axios
      .post(apiCheckingemail, {
        email: event.target.value,
      })
      .then((res) => {
        if (res.data) {
          setEmailCheck(false);
        } else {
          setEmailCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .get(apiRole)
      .then((res) => {
        if (res.data) {
          setAllrole(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if (!prop.admin) {
      axios
        .get(apiGetinfo, {
          headers: {
            Authorization: `Bearer ${prop.jwt_token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUsername(res.data.username);
          setEmail(res.data.email);
          setFirstName(res.data.firstname);
          setLastName(res.data.lastname);
          setTel(res.data.phone);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      const { username, role } = prop.admin;
      const apiGetAdmininfo = config.getApiEndpoint(`getuseradmin/${role}/${username}`, "GET");

      axios
        .get(apiGetAdmininfo, {
          headers: {
            Authorization: `Bearer ${prop.jwt_token}`,
          },
        })
        .then((res) => {
          setUsername(res.data.username);
          setEmail(res.data.email);
          setFirstName(res.data.firstname);
          setLastName(res.data.lastname);
          setTel(res.data.phone);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);


  const validatePassword = (event: React.FocusEvent<HTMLInputElement>) => {
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegExp.test(event.target.value)) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }
  };

  const checkLang = (event: React.FocusEvent<HTMLInputElement>) => {
    const langRegExp = /^[a-zA-Zก-๙]+$/;
    if (langRegExp.test(event.target.value)) {
      if (event.target.id == "firstName") {
        setFirstNameValidate(true);
      } else {
        setLastNameValidate(true);
      }
    } else {
      if (event.target.id == "firstName") {
        setFirstNameValidate(false);
      } else {
        setLastNameValidate(false);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var data = {
      username: username,
      email: email,
      firstname: firstName,
      lastname: lastName,
      phone: tel,
    } as {
      username: string;
      email: string;
      firstname: string;
      lastname: string;
      phone: string;
      role?: string;
    };
    if (prop.admin) {
      data = { ...data, role: prop.admin.role };
    }

    axios
      .post(prop.admin ? apiUpdateInfoadmin : apiUpdateInfo, data, {
        headers: { Authorization: `Bearer ${prop.jwt_token}` },
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 3 }}>
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "green" }}>
          <CreateIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          แก้ไขข้อมูลส่วนตัว
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled
                value={username}
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
                value={email}
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                error={!emailReg}
                helperText={
                  email == "" && emailCheck == false
                    ? "กรุณากรอก Email"
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
            <Grid item xs={12} sm={6}>
              <TextField
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  checkLang(event)
                }
                autoComplete="given-name"
                name="firstName"
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
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  checkLang(event)
                }
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
                value={tel}
                onChange={(event) => setTel(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                  const telRegExp = /^[0-9]{10}$/;
                  if (telRegExp.test(event.target.value)) {
                    setTelValidate(true);
                  } else {
                    setTelValidate(false);
                  }
                }}
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

export default EditProfile;
