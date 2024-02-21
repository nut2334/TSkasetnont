import React, { useEffect, useState } from "react";
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
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import * as config from "../config/config";
import CreateIcon from "@mui/icons-material/Create";
import { jwtDecode } from "jwt-decode";
import { isPropertyAccessOrQualifiedName } from "typescript";

interface province {
  id: string;
  name_th: string;
  amphure: amphure[];
}
interface amphure {
  id: string;
  name_th: string;
  tambon: tambon[];
}
interface tambon {
  id: string;
  name_th: string;
  zip_code: number;
}

const EditProfile = (prop: {
  jwt_token: string;
  admin?: { username: string; role: string };
}) => {
  const apiUpdateInfo = config.getApiEndpoint("updateinfo", "POST");
  const apiRole = config.getApiEndpoint("role", "GET");
  const apiCheckinguser = config.getApiEndpoint("checkinguser", "POST");
  const apiCheckingemail = config.getApiEndpoint("checkingemail", "POST");
  const apiGetinfo = config.getApiEndpoint("getinfo", "GET");
  const apiUpdateInfoadmin = config.getApiEndpoint("updateinfoadmin", "GET");

  const [username, setUsername] = useState<string>("");
  const [usernameCheck, setUsernameCheck] = useState<boolean>(true);
  const [usernameReg, setUsernameReg] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<boolean>(true);
  const [emailReg, setEmailReg] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<boolean>(true);
  const [passwordNew, setPasswordNew] = useState<string>("");
  const [comfirmPassword, setComfirmPassword] = useState<string>("");
  const [comfirmPasswordCheck, setComfirmPasswordCheck] =
    useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameValidate, setFirstNameValidate] = useState<boolean>(true);
  const [lastName, setLastName] = useState<string>("");
  const [lastNameValidate, setLastNameValidate] = useState<boolean>(true);
  const [sameLang, setSameLang] = useState<boolean>(true);
  const [tel, setTel] = React.useState<string>("");
  const [telValidate, setTelValidate] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showComfirmPassword, setShowComfirmPassword] =
    React.useState<boolean>(false);

  const [allrole, setAllrole] = useState<
    [{ role_id: string; role_name: string }]
  >([{ role_id: "", role_name: "" }]);
  const [role, setRole] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");

  const [provinces, setProvinces] = useState<province[]>([]);
  const [amphures, setAmphures] = useState<amphure[]>([]);
  const [tambons, setTambons] = useState<tambon[]>([]);
  const [selected, setSelected] = useState<
    {
      province_name_th: string
      amphure_name_th: string
      tambon_name_th: string
    }
  >({
    province_name_th: "",
    amphure_name_th: "",
    tambon_name_th: "",
  });
  const [zipCode, setZipCode] = useState<number>();
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [lineId, setLineId] = useState<string>("");
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
    } else {
      const { username, role } = prop.admin;
      const apiGetAdmininfo = config.getApiEndpoint(
        `getuseradmin/${role}/${username}`,
        "GET"
      );

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
  useEffect(() => {
    (() => {
      fetch(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);

          setProvinces(result);
        });
    })();
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
      farmerstorename?: string;
      province?: string;
      amphure?: string;
      tambon?: string;
      role?: string;
    };
    if (prop.admin) {
      data = { ...data, role: prop.admin.role };
    }

    if (jwtDecode<{
      role: string;
    }>(prop.jwt_token).role == "farmers" || prop.admin?.role == "farmers") {
      data = {
        ...data,
        farmerstorename: storeName,
        province: selected.province_name_th,
        amphure: selected.amphure_name_th,
        tambon: selected.tambon_name_th,
      };
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
          แก้ไขข้อมูล
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography>ข้อมูลส่วนตัว</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField

                variant="filled"
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
            {(jwtDecode<{
              role: string;
            }>(prop.jwt_token).role == "farmers" || prop.admin?.role == "farmers") &&
              <>
                <Grid item xs={12}>
                  <Divider textAlign="left">
                    <Typography>ข้อมูลร้านค้า</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="ชื่อร้านค้า"
                    fullWidth
                    value={storeName}
                    onChange={(event) => setStoreName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Facebook Link"
                    fullWidth
                    placeholder="https://www.facebook.com/..."
                    value={facebookLink}
                    onChange={(event) => setFacebookLink(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Line id"
                    fullWidth
                    placeholder="@HelloWorld หรือ 0912345678"
                    value={lineId}
                    onChange={(event) => setLineId(event.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    label="จังหวัด"
                    fullWidth
                    onChange={(event) => {
                      setAmphures(provinces.filter((province) => province.name_th == event.target.value)[0].amphure);

                      setSelected({
                        province_name_th: event.target.value ? event.target.value : selected.province_name_th,
                        amphure_name_th: "",
                        tambon_name_th: "",
                      });
                    }}
                  >
                    {provinces.map((province: province) => (
                      <MenuItem value={province.name_th}
                        selected={province.name_th == selected.province_name_th}
                      >{province.name_th}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {amphures.length > 0 && <Grid item xs={12}>
                  <TextField
                    select
                    label="เขต/อำเภอ"
                    fullWidth
                    onChange={(event) => {
                      setTambons(amphures.filter((amphures) => amphures.name_th == event.target.value)[0].tambon);

                      setSelected({
                        ...selected,
                        amphure_name_th: event.target.value ? event.target.value : selected.amphure_name_th,
                        tambon_name_th: "",
                      });

                    }}
                  >
                    {amphures.map((amphure: amphure) => (
                      <MenuItem value={amphure.name_th}
                        selected={amphure.name_th == selected.amphure_name_th}
                      >{amphure.name_th}</MenuItem>
                    ))}
                  </TextField>
                </Grid>}

                {tambons.length > 0 && <Grid item xs={12}>
                  <TextField select label="แขวง/ตำบล" fullWidth onChange={(event) => {
                    setSelected({
                      ...selected,
                      tambon_name_th: event.target.value ? event.target.value : selected.tambon_name_th,
                    });
                    setZipCode(tambons[0].zip_code);
                  }}>
                    {tambons.map((tambon: tambon) => (
                      <MenuItem value={tambon.name_th}
                        selected={tambon.name_th == selected.tambon_name_th}
                      >{tambon.name_th}</MenuItem>
                    ))}
                  </TextField>
                </Grid>}
                <Grid item xs={12}>
                  {zipCode && <TextField label="รหัสไปรษณีย์" fullWidth disabled value={zipCode} />}
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="ที่อยู่" />
                </Grid>
              </>
            }
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography>รหัสผ่าน</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                label="รหัสผ่านเดิม"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  validatePassword(event)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="comfirmPassword"
                label="รหัสผ่านใหม่"
                value={comfirmPassword}
                onChange={(event) => setPasswordNew(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowComfirmPassword}
                        onMouseDown={handleMouseDownComfirmPassword}
                      >
                        {showComfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ยืนยันรหัสผ่านใหม่"
                type={showComfirmPassword ? "text" : "password"}
                value={comfirmPassword}
                onChange={(event) => setComfirmPassword(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowComfirmPassword}
                        onMouseDown={handleMouseDownComfirmPassword}
                      >
                        {showComfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" variant="contained" fullWidth>
                เปลี่ยนรหัสผ่าน
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile;
