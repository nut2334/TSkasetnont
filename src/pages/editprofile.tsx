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
import axios from "axios";
import * as config from "../config/config";
import CreateIcon from "@mui/icons-material/Create";
import { jwtDecode } from "jwt-decode";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon, LatLngLiteral } from "leaflet";
import { EdituserSuccess, EdituserFail } from "../components/popup";

const iconMarker = new Icon({
  iconUrl: require("../assets/icon.svg").default,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -40],
});

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
  const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);

  const [allrole, setAllrole] = useState<
    [{ role_id: string; role_name: string }]
  >([{ role_id: "", role_name: "" }]);
  const [role, setRole] = useState<string>();
  const [storeName, setStoreName] = useState<string>("");

  const [provinces, setProvinces] = useState<province[]>([]);
  const [amphures, setAmphures] = useState<amphure[]>([]);
  const [tambons, setTambons] = useState<tambon[]>([]);
  const [address, setAddress] = useState<string>("");
  const [selected, setSelected] = useState<{
    province_name_th: string;
    amphure_name_th: string;
    tambon_name_th: string;
  }>({
    province_name_th: "",
    amphure_name_th: "",
    tambon_name_th: "",
  });
  const [zipCode, setZipCode] = useState<number>();
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [lineId, setLineId] = useState<string>("");
  const [position, setPosition] = useState<LatLngLiteral>();

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
  const handleClickShowPasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };
  const handleMouseDownPasswordNew = (
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
    const currentRole = jwtDecode(prop.jwt_token) as { role: string };
    setRole(currentRole.role);
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
    (async () => {
      let dataProvinces = await axios.get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      );
      let provinces = dataProvinces.data as province[];
      console.log(provinces);

      if (!prop.admin) {
        axios
          .get(apiGetinfo, {
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
            setSelected({
              province_name_th: res.data.province,
              amphure_name_th: res.data.amphure,
              tambon_name_th: res.data.tambon,
            });
            let amphures;
            if (res.data.province) {
              amphures = provinces.filter(
                (province) => province.name_th == res.data.province
              )[0].amphure;
              setAmphures(amphures);
            }

            if (res.data.amphure && amphures) {
              setTambons(
                amphures.filter(
                  (amphures) => amphures.name_th == res.data.amphure
                )[0].tambon
              );
            }

            setProvinces(provinces);
            setAddress(res.data.address);
            setZipCode(res.data.zipcode);
            setStoreName(res.data.farmerstorename);
            setFacebookLink(res.data.facebooklink);
            setLineId(res.data.lineid);
            setPosition({ lat: res.data.lat, lng: res.data.lng });
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
            setSelected({
              province_name_th: res.data.province,
              amphure_name_th: res.data.amphure,
              tambon_name_th: res.data.tambon,
            });
            let amphures;
            if (res.data.province) {
              amphures = provinces.filter(
                (province) => province.name_th == res.data.province
              )[0].amphure;
              setAmphures(amphures);
            }

            if (res.data.amphure && amphures) {
              setTambons(
                amphures.filter(
                  (amphures) => amphures.name_th == res.data.amphure
                )[0].tambon
              );
            }

            setProvinces(provinces);
            setAddress(res.data.address);
            setZipCode(res.data.zipcode);
            setStoreName(res.data.farmerstorename);
            setFacebookLink(res.data.facebooklink);
            setLineId(res.data.lineid);
            setPosition({ lat: res.data.lat, lng: res.data.lng });
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
  const validatePasswordComfirm = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegExp.test(event.target.value)) {
      setComfirmPasswordCheck(true);
    } else {
      setComfirmPasswordCheck(false);
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
      lat?: number;
      lng?: number;
      facebooklink?: string;
      lineid?: string;
      address?: string;
      zipcode?: number;
    };
    if (prop.admin) {
      data = { ...data, role: prop.admin.role };
    }

    if (
      jwtDecode<{
        role: string;
      }>(prop.jwt_token).role == "farmers" ||
      prop.admin?.role == "farmers"
    ) {
      data = {
        ...data,
        farmerstorename: storeName,
        province: selected.province_name_th,
        amphure: selected.amphure_name_th,
        tambon: selected.tambon_name_th,
        lat: position?.lat,
        lng: position?.lng,
        facebooklink: facebookLink,
        lineid: lineId,
        address: address,
        zipcode: zipCode,
      };
    }

    axios
      .post(prop.admin ? apiUpdateInfoadmin : apiUpdateInfo, data, {
        headers: { Authorization: `Bearer ${prop.jwt_token}` },
      })
      .then((res) => {
        console.log(res.data);
        EdituserSuccess();
      })
      .catch((err) => {
        console.log(err);
        EdituserFail();
      });
  };
  const changePassword = () => {
    console.log(passwordNew, comfirmPassword);
    if (
      passwordNew == comfirmPassword &&
      passwordCheck &&
      comfirmPasswordCheck
    ) {
      let body = {
        newpassword: passwordNew,
      } as {
        newpassword: string;
        oldpassword?: string;
        usernameBody?: string;
        roleBody?: string;
      };

      if (prop.admin) {
        body = {
          ...body,
          usernameBody: prop.admin.username,
          roleBody: prop.admin.role,
        };
      } else {
        body = { ...body, oldpassword: password };
      }
      axios
        .post(config.getApiEndpoint("changepassword", "POST"), body, {
          headers: { Authorization: `Bearer ${prop.jwt_token}` },
        })
        .then((res) => {
          console.log(res.data);
        });
    }
  };

  const CreateMarker = () => {
    useMapEvents({
      // locate latlng on click
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker
        position={
          position
            ? position
            : ({
                lat: 13.736717,
                lng: 100.523186,
              } as LatLngLiteral)
        }
        icon={iconMarker}
      >
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ marginTop: 3, position: "relative" }}
    >
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
            }>(prop.jwt_token).role == "farmers" ||
              prop.admin?.role == "farmers") && (
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
                    value={selected.province_name_th}
                    onChange={(event) => {
                      setAmphures(
                        provinces.filter(
                          (province) => province.name_th == event.target.value
                        )[0].amphure
                      );

                      setSelected({
                        province_name_th: event.target.value
                          ? event.target.value
                          : selected.province_name_th,
                        amphure_name_th: "",
                        tambon_name_th: "",
                      });
                    }}
                  >
                    {provinces.map((province: province) => (
                      <MenuItem value={province.name_th}>
                        {province.name_th}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {amphures.length > 0 && (
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="เขต/อำเภอ"
                      fullWidth
                      value={selected.amphure_name_th}
                      onChange={(event) => {
                        setTambons(
                          amphures.filter(
                            (amphures) => amphures.name_th == event.target.value
                          )[0].tambon
                        );

                        setSelected({
                          ...selected,
                          amphure_name_th: event.target.value
                            ? event.target.value
                            : selected.amphure_name_th,
                          tambon_name_th: "",
                        });
                      }}
                    >
                      {amphures.map((amphure: amphure) => (
                        <MenuItem value={amphure.name_th}>
                          {amphure.name_th}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
                {tambons.length > 0 && (
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="แขวง/ตำบล"
                      fullWidth
                      value={selected.tambon_name_th}
                      onChange={(event) => {
                        setSelected({
                          ...selected,
                          tambon_name_th: event.target.value
                            ? event.target.value
                            : selected.tambon_name_th,
                        });
                        setZipCode(tambons[0].zip_code);
                      }}
                    >
                      {tambons.map((tambon: tambon) => (
                        <MenuItem value={tambon.name_th}>
                          {tambon.name_th}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
                <Grid item xs={12}>
                  {zipCode && (
                    <TextField
                      label="รหัสไปรษณีย์"
                      fullWidth
                      disabled
                      value={zipCode}
                    />
                  )}
                </Grid>
                <MapContainer
                  center={[13.736717, 100.523186]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: "100vh", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <CreateMarker />
                </MapContainer>
              </>
            )}

            {role == "members" ||
              (prop.admin?.role == "members" && provinces && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="จังหวัด"
                      fullWidth
                      value={selected.province_name_th}
                      onChange={(event) => {
                        setAmphures(
                          provinces.filter(
                            (province) => province.name_th == event.target.value
                          )[0].amphure
                        );

                        setSelected({
                          province_name_th: event.target.value
                            ? event.target.value
                            : selected.province_name_th,
                          amphure_name_th: "",
                          tambon_name_th: "",
                        });
                      }}
                    ></TextField>
                  </Grid>
                  {amphures.length > 0 && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="เขต/อำเภอ"
                        fullWidth
                        value={selected.amphure_name_th}
                        onChange={(event) => {
                          setTambons(
                            amphures.filter(
                              (amphures) =>
                                amphures.name_th == event.target.value
                            )[0].tambon
                          );

                          setSelected({
                            ...selected,
                            amphure_name_th: event.target.value
                              ? event.target.value
                              : selected.amphure_name_th,
                            tambon_name_th: "",
                          });
                        }}
                      ></TextField>
                    </Grid>
                  )}
                  {tambons.length > 0 && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="แขวง/ตำบล"
                        fullWidth
                        value={selected.tambon_name_th}
                        onChange={(event) => {
                          setSelected({
                            ...selected,
                            tambon_name_th: event.target.value
                              ? event.target.value
                              : selected.tambon_name_th,
                          });
                          setZipCode(tambons[0].zip_code);
                        }}
                      ></TextField>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    {zipCode && (
                      <TextField
                        label="รหัสไปรษณีย์"
                        fullWidth
                        disabled
                        value={zipCode}
                      />
                    )}
                  </Grid>
                </>
              ))}

            {role == "farmers" ||
              prop.admin?.role == "farmers" ||
              role == "members" ||
              (prop.admin?.role == "members" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="ที่อยู่"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                    }}
                  />
                </Grid>
              ))}
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
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
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
            {!prop.admin && (
              <Grid item xs={12}>
                <TextField
                  type={showPasswordNew ? "text" : "password"}
                  fullWidth
                  label="รหัสผ่านใหม่"
                  value={passwordNew}
                  onChange={(event) => {
                    setPasswordNew(event.target.value);
                  }}
                  onBlur={validatePassword}
                  error={!passwordCheck}
                  helperText={
                    passwordNew == "" && passwordCheck == false
                      ? "กรุณากรอกรหัสผ่าน"
                      : "" || !passwordCheck
                      ? "รหัสผ่านต้องประกอบด้วยตัวอักษรและตัวเลข อย่างน้อย 8 ตัว"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordNew}
                          onMouseDown={handleMouseDownPasswordNew}
                        >
                          {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                error={!comfirmPasswordCheck}
                helperText={
                  comfirmPassword == "" && comfirmPasswordCheck == false
                    ? "กรุณากรอกรหัสผ่าน"
                    : "" || !comfirmPasswordCheck
                    ? "รหัสผ่านต้องประกอบด้วยตัวอักษรและตัวเลข อย่างน้อย 8 ตัว"
                    : ""
                }
                label="ยืนยันรหัสผ่านใหม่"
                type={showComfirmPassword ? "text" : "password"}
                value={comfirmPassword}
                onChange={(event) => {
                  setComfirmPassword(event.target.value);
                }}
                onBlur={validatePasswordComfirm}
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
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={changePassword}
              >
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
