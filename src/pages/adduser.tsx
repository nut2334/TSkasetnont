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
import { AdduserSuccess, AdduserFail } from "../components/popup";
import { NavLink, Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon, LatLngLiteral } from "leaflet";
import { useMap } from "react-leaflet";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import SearchIcon from "@mui/icons-material/Search";
import { jwtDecode } from "jwt-decode";
import { nonthaburi_amphure } from "../config/dataDropdown";
import Path from "../components/path";

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
interface province {
  id: string;
  name_th: string;
  amphure: amphure[];
}
const AddUser = (prop: { jwt_token: string }) => {
  const apiStandard = config.getApiEndpoint("standardproducts", "GET");
  const apiCheckinguser = config.getApiEndpoint("checkinguser", "POST");
  const apiCheckingemail = config.getApiEndpoint("checkingemail", "POST");

  const [username, setUsername] = useState<string>("");
  const [usernameCheck, setUsernameCheck] = useState<boolean>(true);
  const [usernameReg, setUsernameReg] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<boolean>(true);
  const [emailReg, setEmailReg] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<boolean>(true);
  const [comfirmPassword, setComfirmPassword] = useState<string>("");
  const [comfirmPasswordCheck, setComfirmPasswordCheck] =
    useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameValidate, setFirstNameValidate] = useState<boolean>(true);
  const [lastName, setLastName] = useState<string>("");
  const [lastNameValidate, setLastNameValidate] = useState<boolean>(true);
  const [tel, setTel] = useState<string>("");
  const [telValidate, setTelValidate] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showComfirmPassword, setShowComfirmPassword] =
    useState<boolean>(false);
  const [standard, setStandard] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);
  const [selectedStandard, setSelectedStandard] = useState<string[]>([]);
  const [province, setProvince] = useState<province[]>([]);
  const [amphure, setAmphure] = useState<amphure[]>([]);
  const [selectedAmphure, setSelectedAmphure] = useState<string>("");
  const [checkAmphure, setCheckAmphure] = useState<boolean>(true);
  const [exist, setExist] = useState<boolean>(false);
  const [addProduct, setAddProduct] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLngLiteral>();
  const [checkPosition, setCheckPosition] = useState<boolean>(true);
  const [current, setCurrent] = useState<boolean>(false);
  const [amphures, setAmphures] = useState<amphure[]>([]);
  const [tambons, setTambons] = useState<tambon[]>([]);
  const [zipCode, setZipCode] = useState<number>();
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
  const [changelat, setChangelat] = useState<number | null>(null);
  const [changelng, setChangelng] = useState<number | null>(null);

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
        setStandard(
          res.data.filter(
            (data: { standard_id: string; standard_name: string }) => {
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
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      )
      .then((res) => {
        res.data.find((data: { name_th: string; amphure: amphure[] }) => {
          if (data.name_th == "นนทบุรี") {
            console.log(data.amphure);
            setAmphures(data.amphure);
          }
        });
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
    const usernameRegExp = new RegExp(
      /^(?=.*[A-Za-z0-9])[A-Za-z0-9@#$%^&+=]{6,}$/
    );
    if (usernameRegExp.test(event.target.value)) {
      setUsernameReg(true);
    } else {
      setUsernameReg(false);
    }
  };

  const onBlurEmail = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value == "" || event.target.value == null) {
      setEmailCheck(true);
      setEmailReg(true);
    }
    const userData = {
      email: event.target.value,
    };
    const emailRegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
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
    axios
      .post(apiCheckinguser, {
        username: username,
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
    if (!username) {
      setUsernameCheck(false);
    } else {
      setUsernameCheck(true);
    }
    if (!password) {
      setPasswordCheck(false);
    }
    if (!comfirmPassword) {
      setComfirmPasswordCheck(false);
    }
    if (
      !selected.amphure_name_th &&
      ((jwtDecode(prop.jwt_token) as { role: string }).role == "admins" ||
        (jwtDecode(prop.jwt_token) as { role: string }).role == "tambons")
    ) {
      setCheckAmphure(false);
    } else {
      setCheckAmphure(true);
    }
    if (!position && role == "farmers") {
      setCheckPosition(false);
      return;
    } else {
      setCheckPosition(true);
    }

    const data = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      tel: tel,
      certificateList: selectedStandard,
      role: role,
      province: selected.province_name_th,
      amphure: selected.amphure_name_th,
      tambon: selected.tambon_name_th,
      address: address,
      lat: position?.lat,
      lng: position?.lng,
    };
    console.log(data);
    if (role == "farmers" || role == "tambons") {
      data["province"] = "นนทบุรี";
      console.log((jwtDecode(prop.jwt_token) as { amphure: string }).amphure);
    }
    if ((jwtDecode(prop.jwt_token) as { role: string }).role == "tambons") {
      data["amphure"] = (
        jwtDecode(prop.jwt_token) as { amphure: string }
      ).amphure;
    }
    const apiAddUser = config.getApiEndpoint("adduser", "POST");

    axios
      .post(apiAddUser, data, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        if (role == "farmers") {
          Swal.fire({
            icon: "success",
            title: "เพิ่มผู้ใช้งานสำเร็จ",
            text: "ต้องการเพิ่มสินค้าของเกษตรกรคนนี้หรือไม่?",
            showCancelButton: true,
            confirmButtonText: "ย้อนกลับ",
            cancelButtonText: "เพิ่มสินค้า",
          }).then((result) => {
            if (result.isConfirmed) {
              setExist(true);
            } else {
              setAddProduct(true);
            }
          });
        } else {
          AdduserSuccess();
          setExist(true);
        }
      })
      .catch((err) => {
        AdduserFail();
      });
  };
  const CreateMarker = (prop: { current: boolean }) => {
    const map = useMap();
    const [initialFly, setInitialFly] = useState<boolean>(true);
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setChangelat(e.latlng.lat);
        setChangelng(e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
        if (prop.current) {
          setCurrent(false);
        }
      },
    });
    useEffect(() => {
      if (position && initialFly) {
        map.flyTo(position, map.getZoom());
        setInitialFly(false);
      }
    }, []);
    useEffect(() => {
      if (prop.current && position == undefined) {
        map.locate().on("locationfound", function (e) {
          setPosition(e.latlng);
          setChangelat(e.latlng.lat);
          setChangelng(e.latlng.lng);
          map.flyTo(e.latlng, map.getZoom());
        });
      }
    }, [map]);

    return position ? (
      <Marker position={position} icon={iconMarker}>
        <Popup>
          ละติจูด: {position.lat} <br /> ลองจิจูด: {position.lng}
        </Popup>
      </Marker>
    ) : null;
  };
  const iconMarker = new Icon({
    iconUrl: require("../assets/icon.svg").default,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -40],
  });

  if (exist) {
    return <Navigate to={`/manageuser/${role}`} />;
  }
  if (addProduct) {
    return <Navigate to={`/manageuser/farmers/${username}`} />;
  }

  return (
    <Container component="main" maxWidth="lg">
      <Path />
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
            ? "เกษตรจังหวัด"
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
                value={username}
                error={!usernameCheck || !usernameReg}
                helperText={
                  username == "" && usernameCheck == false
                    ? "กรุณากรอก Username"
                    : "" || !usernameCheck
                    ? "Username นี้มีผู้ใช้งานแล้ว"
                    : "" || !usernameReg
                    ? "ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น และมีความยาว 6 ตัวขึ้นไป"
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
                value={email}
                error={
                  (!emailCheck && email != "") || (!emailReg && email != "")
                }
                helperText={
                  email == ""
                    ? ""
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
                value={password}
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
                value={comfirmPassword}
                onChange={(event) => {
                  setComfirmPassword(event.target.value);
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
            {role == "tambons" ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="amphure"
                  label="อำเภอ"
                  name="amphure"
                  select
                  required
                  value={selectedAmphure}
                  error={!checkAmphure && selectedAmphure == ""}
                  helperText={checkAmphure == false ? "กรุณาเลือกอำเภอ" : ""}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setSelectedAmphure(event.target.value);
                    setSelected({
                      ...selected,
                      amphure_name_th: event.target.value,
                    });
                  }}
                >
                  {/* เฉพาะจังหวัดนนทบุรี */}
                  {nonthaburi_amphure.map((amphure) => (
                    <MenuItem value={amphure.amphureName}>
                      {amphure.amphureName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            ) : null}
            {role == "farmers" ? (
              <>
                <Grid item xs={12}>
                  <Divider textAlign="left">
                    <Typography>ที่อยู่</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="จังหวัด"
                    fullWidth
                    disabled
                    value="นนทบุรี"
                  ></TextField>
                </Grid>

                {(jwtDecode(prop.jwt_token) as { amphure: string }).amphure ? (
                  <Grid item xs={12}>
                    <TextField
                      label="เขต/อำเภอ"
                      fullWidth
                      disabled
                      value={
                        (jwtDecode(prop.jwt_token) as { amphure: string })
                          .amphure
                      }
                    ></TextField>
                  </Grid>
                ) : null}

                {(jwtDecode(prop.jwt_token) as { role: string }).role !==
                  "tambons" && amphures.length > 0 ? (
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="เขต/อำเภอ"
                      fullWidth
                      required
                      value={selected.amphure_name_th}
                      error={!checkAmphure}
                      helperText={
                        selected.amphure_name_th == "" && checkAmphure == false
                          ? "กรุณาเลือกเขต/อำเภอ"
                          : ""
                      }
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
                ) : null}

                {tambons.length > 0 && (
                  <>
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
                )}
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
                <Grid item xs={12}>
                  <MapContainer
                    center={[13.736717, 100.523186]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "250px", width: "100%" }}
                  >
                    {/* 
                    <TileLayer url="https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png" />
                 */}

                    <TileLayer
                      attribution="Google Maps Satellite"
                      url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                    />
                    <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
                    <CreateMarker current={current} />
                  </MapContainer>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    startIcon={<LocationSearchingIcon />}
                    variant="contained"
                    color={`${current ? "warning" : "success"}`}
                    onClick={() => {
                      setPosition(undefined);
                      setCurrent(!current);
                    }}
                  >
                    ตำแหน่งปัจจุบัน
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    size="small"
                    label="ละติจูด"
                    required
                    value={changelat}
                    onChange={(e) => setChangelat(parseFloat(e.target.value))}
                    inputProps={{ min: 0 }}
                    error={checkPosition ? false : true}
                    type="number"
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="ลองจิจูด"
                    size="small"
                    value={changelng}
                    onChange={(e) => setChangelng(parseFloat(e.target.value))}
                    inputProps={{ min: 0 }}
                    error={checkPosition ? false : true}
                    helperText={checkPosition ? "" : "กรุณากรอกตำแหน่ง"}
                    required
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() => {
                      if (changelat == null || changelng == null) {
                        setCheckPosition(false);
                        return;
                      }
                      setPosition({ lat: changelat, lng: changelng });
                    }}
                  >
                    ค้นหา
                  </Button>
                </Grid>
              </>
            ) : null}

            {/* {role == "farmers" ? (
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
            ) : null} */}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <NavLink to={`/manageuser/${role}`}>
                <Button color="error" variant="contained">
                  ยกเลิก
                </Button>
              </NavLink>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ color: "#fff" }}
                disabled={!username || !password}
                sx={{
                  marginLeft: 2,
                }}
              >
                ยืนยัน
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AddUser;
