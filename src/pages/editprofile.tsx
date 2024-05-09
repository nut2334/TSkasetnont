import React, { useEffect, useRef, useState } from "react";
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
import { useMap } from "react-leaflet";
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
import Swal from "sweetalert2";
import SetDataCarriage from "../components/setDataCarriage";
import Follow from "./member/follow";
import { nonthaburi_amphure } from "../config/dataDropdown";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import Cookies from "universal-cookie";
import Path from "../components/path";

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
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
  admin?: { username: string; role: string };
  followList: { id: string; farmerstorename: string }[];
  setFollowList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        farmerstorename: string;
      }[]
    >
  >;
}) => {
  const apiUpdateInfo = config.getApiEndpoint("updateinfo", "POST");
  const apiUpdateInfoadmin = config.getApiEndpoint("updateinfoadmin", "GET");
  const apiRole = config.getApiEndpoint("role", "GET");
  const apiCheckingemail = config.getApiEndpoint("checkingemail", "POST");
  const apiGetinfo = config.getApiEndpoint("getinfo", "GET");

  const [role, setRole] = useState<string>();

  const [username, setUsername] = useState<string>("");
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
  const [checkAmphure, setCheckAmphure] = useState<boolean>(true);
  const [zipCode, setZipCode] = useState<number>();
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [lineId, setLineId] = useState<string>("");
  const [position, setPosition] = useState<LatLngLiteral>();
  const [payment, setPayment] = useState<string>("");
  const [current, setCurrent] = useState<boolean>(false);
  const [shippingcost, setShippingCost] = useState<
    {
      weight: number;
      price: number;
    }[]
  >([{ weight: 0, price: 0 }]);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [changelat, setChangelat] = useState<string>();
  const [changelng, setChangelng] = useState<number>();
  const [checkPosition, setCheckPosition] = useState<boolean>(true);
  const [editor_info, setEditor_info] = useState<{
    editor_username: string;
    lastmodified: string;
  }>();
  const inputlng = changelng === 0 || changelng ? changelng : "";

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

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

  const onBlurEmail = (event: React.FocusEvent<HTMLInputElement>) => {
    const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegExp.test(event.target.value)) {
      setEmailReg(true);
    } else {
      setEmailReg(false);
    }
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
  useEffect(() => {
    (async () => {
      let dataProvinces = await axios.get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      );

      let provinces = dataProvinces.data as province[];
      if (!prop.admin) {
        axios
          .get(apiGetinfo, {
            headers: {
              Authorization: `Bearer ${prop.jwt_token}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            setEditor_info(res.data.editor_info);
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
            console.log(res.data);

            if (res.data.shippingcost) {
              console.log(res.data.shippingcost);
              console.log(JSON.parse(res.data.shippingcost));
              setShippingCost(JSON.parse(res.data.shippingcost));
            }
            setAddress(res.data.address);
            setZipCode(res.data.zipcode);
            setStoreName(res.data.farmerstorename);
            setFacebookLink(res.data.facebooklink);
            setLineId(res.data.lineid);
            if (res.data.lat && res.data.lng) {
              setChangelat(res.data.lat);
              setChangelng(parseFloat(res.data.lng));
              setPosition({
                lat: parseFloat(res.data.lat),
                lng: parseFloat(res.data.lng),
              });
            }
            setSelected({
              province_name_th: res.data.province,
              amphure_name_th: res.data.amphure,
              tambon_name_th: res.data.tambon,
            });
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

            console.log(res.data);
            console.log("res.data.shippingcost", res.data.shippingcost);

            if (res.data.shippingcost) {
              console.log(res.data.shippingcost);
              console.log(JSON.parse(res.data.shippingcost));

              setShippingCost(JSON.parse(res.data.shippingcost));
            }
            setProvinces(provinces);
            setAddress(res.data.address);
            setZipCode(res.data.zipcode);
            setStoreName(res.data.farmerstorename);
            setFacebookLink(res.data.facebooklink);
            setLineId(res.data.lineid);
            if (res.data.lat && res.data.lng) {
              setChangelat(res.data.lat);
              setChangelng(parseFloat(res.data.lng));
              setPosition({
                lat: parseFloat(res.data.lat),
                lng: parseFloat(res.data.lng),
              });
            }
            setSelected({
              province_name_th: res.data.province,
              amphure_name_th: res.data.amphure,
              tambon_name_th: res.data.tambon,
            });
            setEditor_info(res.data.editor_info);
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

    if (role == "tambons" || prop.admin?.role == "tambons") {
      console.log(selected.amphure_name_th);
      if (selected.amphure_name_th == undefined) {
        setCheckAmphure(false);
      } else {
        setCheckAmphure(true);
      }
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("phone", tel);
    if (prop.admin) {
      formData.append("role", prop.admin.role);
    }

    if (role == "farmers" || prop.admin?.role == "farmers") {
      console.log(2);
      if (changelat && changelng) {
        formData.append("lat", changelat);
        formData.append("lng", changelng.toString());
      } else {
        setCheckPosition(false);
        return;
      }
      formData.append("address", address);
      formData.append("farmerstorename", storeName);

      formData.append("province", "นนทบุรี");
      formData.append("amphure", selected.amphure_name_th);
      formData.append("tambon", selected.tambon_name_th);
      formData.append("facebooklink", facebookLink);
      formData.append("lineid", lineId);
      if (zipCode) {
        formData.append("zipcode", zipCode.toString());
      }
      formData.append("shippingcost", JSON.stringify(shippingcost));
      console.log(qrCode);
      if (qrCode) {
        formData.append("image", qrCode);
      } else {
        console.log("no qrCode");
      }
    }
    if (role == "members" || prop.admin?.role == "members") {
      formData.append("address", address);
    }
    if (role == "tambons" || prop.admin?.role == "tambons") {
      formData.append("amphure", selected.amphure_name_th);
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    axios
      .post(prop.admin ? apiUpdateInfoadmin : apiUpdateInfo, formData, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.newToken) {
          const cookies = new Cookies();
          cookies.set("jwt_token", res.data.newToken, {
            path: "/",
            sameSite: "strict",
            secure: true,
          });

          prop.setJwt_token(res.data.newToken);
        }
        EdituserSuccess();
      })
      .catch((err) => {
        console.log(err);
        EdituserFail();
      });
  };
  const changePassword = () => {
    console.log("passwordNew: ", passwordNew);
    console.log("comfirmPassword: ", comfirmPassword);
    console.log("passwordCheck: ", passwordCheck);
    console.log("comfirmPasswordCheck: ", comfirmPasswordCheck);
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
          Swal.fire({
            icon: "success",
            title: "เปลี่ยนรหัสผ่านสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };

  const CreateMarker = (prop: { current: boolean }) => {
    const map = useMap();
    const [initialFly, setInitialFly] = useState<boolean>(true);
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setChangelat(e.latlng.lat.toString());
        setChangelng(e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
        if (prop.current) {
          setCurrent(false);
        }
      },
    });
    useEffect(() => {
      if (position && initialFly) {
        console.log(position);
        map.flyTo(position, map.getZoom());
        setInitialFly(false);
      }
    }, []);
    useEffect(() => {
      if (prop.current && position == undefined) {
        map.locate().on("locationfound", function (e) {
          setPosition(e.latlng);
          setChangelat(e.latlng.lat.toString());
          setChangelng(e.latlng.lng);
          map.flyTo(e.latlng, map.getZoom());
        });
      }
    }, [map]);

    return position ? (
      <Marker position={position} icon={iconMarker}>
        <Popup>
          You are here. <br />
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ marginTop: 3, position: "relative", marginBottom: 10 }}
    >
      <Path />
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
          <Grid item xs={12} textAlign="right">
            <Typography color="textSecondary">
              แก้ไขล่าสุดโดย {editor_info && editor_info.editor_username} วันที่{" "}
              {editor_info &&
                new Date(editor_info?.lastmodified).toLocaleDateString(
                  "th-TH",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    minute: "numeric",
                    hour: "numeric",
                  }
                )}
            </Typography>
          </Grid>
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
                helperText={!emailReg ? "กรุณากรอก Email ให้ถูกต้อง" : ""}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlurEmail(event)
                }
                required={role == "members"}
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
                required
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
                required
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
                required
              />
            </Grid>
            {(role == "farmers" || prop.admin?.role == "farmers") && (
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
                    label="ช่องทางการชำระเงิน"
                    fullWidth
                    value={payment}
                    onChange={(event) => setPayment(event.target.value)}
                  />
                </Grid>
                {role == "farmers" && (
                  <Grid item xs={12}>
                    <Button
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      QR Code การชำระเงิน
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files?.length > 0) {
                            setQrCode(e.target.files[0]);
                            console.log(e.target.files);
                          } else {
                            console.log("no file");
                            setQrCode(null);
                          }
                        }}
                      />
                    </Button>
                  </Grid>
                )}
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
                    label="Line ID"
                    fullWidth
                    placeholder="@HelloWorld หรือ 0912345678"
                    value={lineId}
                    onChange={(event) => setLineId(event.target.value)}
                  />
                </Grid>

                <SetDataCarriage
                  unit="กรัม"
                  dataCarriage={shippingcost}
                  setDataCarriage={setShippingCost}
                />
              </>
            )}
            {(role == "tambons" ||
              prop.admin?.role == "tambons" ||
              role == "farmers" ||
              prop.admin?.role == "farmers") && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="จังหวัด"
                    fullWidth
                    disabled
                    value="นนทบุรี"
                  ></TextField>
                </Grid>
                {amphures.length > 0 && (
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
                      }}
                    >
                      {amphures.map((amphure: amphure) => (
                        <MenuItem
                          value={amphure.name_th}
                          onClick={() => {
                            setSelected({
                              ...selected,
                              amphure_name_th: amphure.name_th,
                            });
                          }}
                        >
                          {amphure.name_th}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </>
            )}
            {(role == "farmers" || prop.admin?.role == "farmers") &&
              tambons.length > 0 && (
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
            {role == "farmers" || prop.admin?.role == "farmers" ? (
              <>
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
                    onChange={(e) => setChangelat(e.target.value)}
                    value={changelat}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={checkPosition ? false : true}
                    type="number"
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="ลองจิจูด"
                    size="small"
                    onChange={(e) => setChangelng(parseFloat(e.target.value))}
                    value={inputlng}
                    error={checkPosition ? false : true}
                    helperText={checkPosition ? "" : "กรุณากรอกตำแหน่ง"}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() => {
                      if (changelat && changelng) {
                        setPosition({
                          lat: parseFloat(changelat),
                          lng: changelng,
                        });
                        setCheckPosition(true);
                      } else {
                        setCheckPosition(false);
                      }
                    }}
                  >
                    ค้นหา
                  </Button>
                </Grid>
              </>
            ) : (
              ""
            )}

            {(role == "farmers" ||
              prop.admin?.role == "farmers" ||
              role == "members" ||
              prop.admin?.role == "members") && (
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
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                style={{ color: "#fff" }}
                disabled={
                  (role !== "farmers" || prop.admin?.role !== "farmers") &&
                  (role !== "tambons" || prop.admin?.role !== "tambons")
                    ? !emailReg
                    : !selected.amphure_name_th
                }
              >
                ยืนยัน
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography>รหัสผ่าน</Typography>
              </Divider>
            </Grid>
            {!prop.admin && (
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
            )}

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
                disabled={
                  passwordNew == "" ||
                  comfirmPassword == "" ||
                  !comfirmPasswordCheck ||
                  !passwordCheck
                }
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {role == "members" && (
        <Follow
          followList={prop.followList}
          jwt_token={prop.jwt_token}
          setFollowList={prop.setFollowList}
        />
      )}
    </Container>
  );
};

export default EditProfile;
