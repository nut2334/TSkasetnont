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
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  List,
  ListSubheader,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import * as config from "../config/config";
import { AdduserSuccess, AdduserFail } from "../components/popup";
import { useParams } from "react-router-dom";

const AddUser = (prop: { jwt_token: string }) => {
  const apiRole = config.getApiEndpoint("role", "GET");
  const apiStandard = config.getApiEndpoint("standardproducts", "GET");
  const apiCheckinguser = config.getApiEndpoint("checkinguser", "POST");
  const apiCheckingemail = config.getApiEndpoint("checkingemail", "POST");
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
  const [tel, setTel] = React.useState<string>("");
  const [telValidate, setTelValidate] = React.useState<boolean>(true);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showComfirmPassword, setShowComfirmPassword] =
    React.useState<boolean>(false);
  const [roleCheck, setRoleCheck] = React.useState<boolean>(true);
  const [checked, setChecked] = React.useState([0]);
  const [standard, setStandard] = React.useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);
  const [selectedStandard, setSelectedStandard] = React.useState<string[]>([]);
  const { role } = useParams() as {
    role: "admins" | "tambons" | "farmers" | "providers" | "members";
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    axios
      .get(apiStandard)
      .then((res) => {
        console.log(res.data);
        setStandard(
          res.data.filter(
            (data: { standard_id: string; standard_name: string }) => {
              console.log(data.standard_id);
              if (
                data.standard_name !== "ไม่มี" &&
                data.standard_name !== "อื่นๆ"
              ) {
                return {
                  standard_id: data.standard_id,
                  standard_name: data.standard_name,
                };
              }
            }
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        if (res.data.exist == true) {
          setUsernameCheck(false);
        } else {
          setUsernameCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    const usernameRegExp = new RegExp("^[a-zA-Z0-9]{6,}$");
    if (usernameRegExp.test(event.target.value)) {
      setUsernameReg(true);
    } else {
      setUsernameReg(false);
    }
  };

  const onBlurEmail = (event: React.FocusEvent<HTMLInputElement>) => {
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

  const sendToBackend = (userData: { email: string }) => {
    axios
      .post(apiCheckingemail, userData)
      .then((res) => {
        if (res.data.exist == true) {
          setEmailCheck(false);
        } else {
          setEmailCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validatePassword = (event: React.FocusEvent<HTMLInputElement>) => {
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegExp.test(event.target.value)) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }
  };

  const checkLang = (event: React.FocusEvent<HTMLInputElement>) => {
    const langRegExp = /^[a-zA-Zก-๏\s]+$/;
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
    if (!username) {
      setUsernameCheck(false);
    }
    if (!password) {
      setPasswordCheck(false);
    }
    if (!comfirmPassword) {
      setComfirmPasswordCheck(false);
    }
    if (!role) {
      setRoleCheck(false);
      return;
    }

    const data = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      tel: tel,
      role: role,
      certificateList: selectedStandard,
    };
    console.log(data);

    const apiAddUser = config.getApiEndpoint("adduser", "POST");

    axios
      .post(apiAddUser, data, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        AdduserSuccess();
      })
      .catch((err) => {
        AdduserFail();
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "green" }}>
          <AddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          เพิ่ม
          {role == "admins"
            ? "ผู้ดูแลระบบ"
            : role == "tambons"
            ? "เจ้าหน้าที่ตำบล"
            : role == "farmers"
            ? "เกษตรกร"
            : role == "providers"
            ? "ผู้ว่าราชการจังหวัด"
            : role == "members"
            ? "สมาชิก"
            : ""}
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
                onChange={(event) => {
                  if (event.target.value != "") {
                    setComfirmPassword(event.target.value);
                  }
                  if (event.target.value != password) {
                    setComfirmPasswordCheck(false);
                  } else {
                    setComfirmPasswordCheck(true);
                  }
                }}
                error={!comfirmPasswordCheck}
                fullWidth
                helperText={
                  (comfirmPassword == "" || comfirmPassword == null) &&
                  comfirmPasswordCheck == false
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
                fullWidth
                id="firstName"
                label="ชื่อ"
                error={!firstNameValidate}
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
                fullWidth
                id="lastName"
                label="นามสกุล"
                name="lastName"
                autoComplete="family-name"
                error={!lastNameValidate}
                helperText={
                  lastName == "" && lastNameValidate == false
                    ? "กรุณากรอกนามสกุล"
                    : "" || !lastNameValidate
                    ? "นามสกุลต้องเป็นภาษาไทย หรือ ภาษาอังกฤษ"
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
            {role == "farmers" ? (
              <Grid item xs={12}>
                <List
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      มาตรฐานสินค้า
                    </ListSubheader>
                  }
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {standard.map((data, index) => (
                    <ListItem key={data.standard_id} disablePadding>
                      <ListItemButton dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": data.standard_id }}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStandard([
                                  ...selectedStandard,
                                  data.standard_id,
                                ]);
                              } else {
                                setSelectedStandard(
                                  selectedStandard.filter(
                                    (standard) => standard !== data.standard_id
                                  )
                                );
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={data.standard_id}
                          primary={data.standard_name}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ) : null}
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

export default AddUser;
