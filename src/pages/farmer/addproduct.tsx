import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
  TextField,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import DropdownCatagory from "../../components/dropdownCatagory";
import { reservation_status, web_activity } from "../../config/dataDropdown";
import * as config from "../../config/config";
import { useParams } from "react-router-dom";
import Imagestore from "../../components/imagestore";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/system";
import Pricecenter from "./pricecenter";
import Path from "../../components/path";

interface certificateInterface {
  standard_id: string;
  date_recieve: Date;
}

interface allStandardInterface {
  standard_id: string;
  standard_name: string;
  expire: boolean;
  available: boolean;
}

const AddProduct = (prop: { jwt_token: string }) => {
  const apiAllStandard = config.getApiEndpoint("standardproducts", "GET");
  const apiAddProduct = config.getApiEndpoint("addproduct", "POST");

  const [productName, setProductName] = useState<string>("");
  const [checkProductName, setCheckProductName] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [checkCategory, setCheckCategory] = useState<boolean>(true);

  const [coverImage, setCoverImage] = useState<string[]>([]);
  const [checkCoverImage, setCheckCoverImage] = useState<boolean>(true);
  const [productVideo, setProductVideo] = useState<string[]>([]);
  const [selectImage, setSelectImage] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedType, setSelectedType] = useState<string>("");
  const [checkType, setCheckType] = useState<boolean>(true);

  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(1);
  const [weight, setWeight] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [checkUnit, setCheckUnit] = useState<boolean>(true);
  const [regUnit, setRegUnit] = useState<boolean>(true);
  const [startDate, setStartDate] = useState(null);
  const [checkstartDate, setCheckStartDate] = useState<boolean>(true);
  const [endDate, setEndDate] = useState(null);
  const [checkendDate, setCheckEndDate] = useState<boolean>(true);
  const [allStandard, setAllStandard] = useState<allStandardInterface[]>([]);
  const [selectedStandard, setSelectedStandard] = React.useState<
    {
      standard_id: string;
      status: string;
      date_expired?: Date;
      date_recieve?: Date;
      date_request?: Date;
    }[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [certificate, setCertificate] = useState<certificateInterface[]>([]);
  const [checkStatus, setCheckStatus] = useState<boolean>(true);
  const [stock, setStock] = useState<number>(0);
  const { productid, username, shopname } = useParams<{
    productid: string;
    username: string;
    shopname: string;
  }>();

  const [modalIsOpen, setIsOpen] = useState<{
    isOpen: boolean;
    imageSelect: number;
    imageType: "image" | "video";
    selectImage: string[];
    setStateImage: React.Dispatch<React.SetStateAction<string[]>>;
  } | null>();
  const [isExist, setIsExist] = useState<boolean>(false);
  const [monthreceived, setMonthreceived] = useState<Date | null>(null);
  const [checkWeight, setCheckWeight] = useState<boolean>(true);
  const [editor_info, setEditor_info] = useState<{
    editor_username: string;
    lastmodified: string;
  }>();

  function closeModal() {
    setIsOpen(null);
  }

  useEffect(() => {
    console.log(selectedStandard);
  }, [selectedStandard]);

  useEffect(() => {
    if (productid) {
      let apiGetProduct = config.getApiEndpoint(
        `getproduct/${shopname}/${productid}`,
        "GET"
      );

      axios.get(apiGetProduct).then((res) => {
        if (res.data) {
          console.log(res.data);
          setProductName(res.data.product_name);
          setSelectedCategory(res.data.category_id);
          setDescription(res.data.product_description);
          setSelectedType(res.data.selectedType);
          setWeight(res.data.weight);
          setPrice(res.data.price);
          setUnit(res.data.unit);
          setStock(res.data.stock);
          setSelectedStatus(res.data.selectedStatus);
          setStartDate(res.data.date_reserve_start);
          setEndDate(res.data.date_reserve_end);
          setCoverImage([res.data.product_image]);
          setProductVideo(
            res.data.product_video ? [res.data.product_video] : []
          );
          setSelectImage(
            res.data.additional_image
              ? JSON.parse(res.data.additional_image)
              : []
          );
          console.log(JSON.parse(res.data.certificate));
          setSelectedStandard(JSON.parse(res.data.certificate));
          setCertificate(JSON.parse(res.data.certificate));
          setMonthreceived(res.data.forecastDate);
          setEditor_info(res.data.editor_info);
        }
      });
    }

    axios.get(apiAllStandard).then((res) => {
      if (res.data) {
        console.log(res.data);
        setAllStandard(res.data);
      }
    });
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  };

  const handleOpenDialog = (index: number) => {
    setCurrentImageIndex(index);
    setOpenDialog(true);
  };

  const handleReservationStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedStatusName = event.target.value;
    const selectedStatus = reservation_status.find(
      (option) => option.statusName === selectedStatusName
    );
    if (selectedStatus) {
      setSelectedStatus(selectedStatus.statusName);
      setStartDate(null);
      setEndDate(null);
    }
  };
  const onSubmit = () => {
    let check = true;
    if (productName == "") {
      setCheckProductName(false);
      check = false;
    } else {
      setCheckProductName(true);
    }

    if (selectedCategory == "") {
      setCheckCategory(false);
      check = false;
    } else {
      setCheckCategory(true);
    }
    if (selectedType == "") {
      setCheckType(false);
      check = false;
    } else {
      setCheckType(true);
    }
    if (coverImage.length == 0) {
      setCheckCoverImage(false);
      check = false;
    } else {
      setCheckCoverImage(true);
    }

    if (selectedType == "จองสินค้าผ่านเว็บไซต์" && !selectedStatus) {
      setCheckStatus(false);
      check = false;
    } else {
      setCheckStatus(true);
    }

    if (selectedStatus == "เปิดรับจองตามช่วงเวลา" && !startDate && !endDate) {
      if (!startDate) {
        setCheckStartDate(false);
        check = false;
      }
      if (!endDate) {
        setCheckEndDate(false);
        check = false;
      }
    }
    if (selectedType == "สินค้าจัดส่งพัสดุ" && weight == 0) {
      setCheckWeight(false);
      check = false;
    }
    if (selectedType == "สินค้าจัดส่งพัสดุ" && weight > 0) {
      setCheckWeight(true);
    }
    if (!unit) {
      setCheckUnit(false);
      check = false;
    } else {
      setCheckUnit(true);
      let regUnit = /^[ก-๏a-zA-Z0-9\s]+$/;
      if (!regUnit.test(unit)) {
        setRegUnit(false);
        check = false;
      }
    }

    if (!check) {
      return;
    }

    let body = {
      product_name: productName,
      category_id: selectedCategory,
      product_description: description,
      selectedType: selectedType,
      price: price,
      weight: weight,
      unit: unit,
      stock: stock,
      selectedStatus: selectedStatus,
      date_reserve_start: startDate,
      date_reserve_end: endDate,
      product_image: coverImage[0],
      product_video: productVideo[0],
      additional_images: JSON.stringify(selectImage),
      certificate: JSON.stringify(selectedStandard),
      period:
        selectedStatus == "เปิดรับจองตามช่วงเวลา" ? endDate : monthreceived,
      forecastDate: monthreceived,
    } as any;

    if (selectedType == "สินค้าจัดส่งพัสดุ") {
      if (stock == null) {
        body = {
          ...body,
          stock: 0,
        };
      }
    }

    //จะเป็นการแก้ไขเมื่อมี productid
    if (productid) {
      body = {
        ...body,
        product_id: productid,
      };
    }
    const jwt = jwtDecode(prop.jwt_token) as {
      role: string;
      ID: string;
      username: string;
    };
    if (jwt.role === "tambons" || jwt.role === "admins") {
      body = {
        ...body,
        username: username,
      };
    }
    console.log(body);
    axios
      .post(apiAddProduct, body, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสำเร็จ",
          showCancelButton: true,
          confirmButtonText: "เสร็จสิ้น",
          cancelButtonText: "เพิ่มสินค้าต่อ",
        })
          .then((result) => {
            if (result.isConfirmed) {
              setIsExist(true);
            } else {
              setProductName("");
              setSelectedCategory("");
              setDescription("");
              setSelectedType("");
              setPrice(0);
              setUnit("");
              setStock(0);
              setSelectedStatus("");
              setStartDate(null);
              setEndDate(null);
              setCoverImage([]);
              setProductVideo([]);
              setSelectImage([]);
              setSelectedType("");
              setSelectedStandard([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "บันทึกข้อมูลไม่สำเร็จ",
          text: err.response.data.message,
        });
      });
  };
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

  if (isExist) {
    if ((jwtDecode(prop.jwt_token) as { role: string }).role === "farmers") {
      return <Navigate to="/myproducts" />;
    } else {
      return <Navigate to={`/manageuser/farmers/${username}`} />;
    }
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="md">
        <Path />
        <Box
          sx={{
            marginTop: 5,
            marginBottom: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {productid ? (
            <>
              <Avatar sx={{ m: 1, bgcolor: "green" }}>
                <EditIcon />
              </Avatar>
              <Typography variant="h5">แก้ไขสินค้า</Typography>
            </>
          ) : (
            <>
              <Avatar sx={{ m: 1, bgcolor: "green" }}>
                <AddBusinessIcon />
              </Avatar>
              <Typography variant="h5">เพิ่มสินค้า</Typography>
            </>
          )}
        </Box>
        <form>
          <Grid container spacing={2} sx={{ marginBottom: 1 }}>
            {editor_info && editor_info.editor_username && (
              <Grid item xs={12} textAlign="right">
                <Typography color="textSecondary">
                  แก้ไขล่าสุดโดย {editor_info && editor_info.editor_username}{" "}
                  วันที่{" "}
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
            )}

            <Pricecenter />
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography>จัดการสินค้า</Typography>
              </Divider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-basic"
                label="ชื่อสินค้า"
                variant="outlined"
                value={productName}
                fullWidth
                onChange={(e) => setProductName(e.target.value)}
                error={!checkProductName}
                helperText={!checkProductName && "กรุณากรอกชื่อสินค้า"}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <DropdownCatagory
                value={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                checkCategory={checkCategory}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="รายละเอียดสินค้า"
                type="text"
                multiline
                fullWidth
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography>รูปปก*</Typography>
              {checkCoverImage == false && (
                <Typography color="red">กรุณาใส่รูปปก</Typography>
              )}

              <Button
                onClick={() => {
                  setIsOpen({
                    isOpen: true,
                    imageSelect: 1,
                    selectImage: coverImage,
                    imageType: "image",
                    setStateImage: setCoverImage,
                  });
                }}
                variant="contained"
                color="info"
                startIcon={<AddPhotoAlternateIcon />}
              >
                เลือกรูปภาพ
              </Button>
              {coverImage.length > 0 && (
                <Button
                  color="error"
                  sx={{
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setCoverImage([]);
                  }}
                  variant="contained"
                >
                  <ClearIcon />
                </Button>
              )}

              {coverImage[0] && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={`${config.getApiEndpoint(
                      `getimage/${coverImage[0].split("/").pop()}`,
                      "get"
                    )}`}
                    alt="Product Cover"
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "5px",
                      cursor: "pointer",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              )}
            </Grid>
            {modalIsOpen && (
              <Imagestore
                modalIsOpen={modalIsOpen.isOpen}
                closeModal={closeModal}
                imgType={modalIsOpen.imageType}
                imageSelect={modalIsOpen.imageSelect}
                selectImage={modalIsOpen.selectImage}
                setSelectImage={modalIsOpen.setStateImage}
                jwt_token={prop.jwt_token}
              />
            )}
            <Grid item xs={12} lg={6}>
              <Typography>วิดีโอ</Typography>
              <Button
                onClick={() => {
                  setIsOpen({
                    isOpen: true,
                    imageSelect: 1,
                    selectImage: productVideo,
                    imageType: "video",
                    setStateImage: setProductVideo,
                  });
                }}
                variant="contained"
                color="info"
                startIcon={<VideoFileIcon />}
              >
                เลือกวิดิโอ
              </Button>
              {productVideo.length > 0 && (
                <Button
                  color="error"
                  sx={{
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setProductVideo([]);
                  }}
                  variant="contained"
                >
                  <ClearIcon />
                </Button>
              )}
              {productVideo.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <video
                    src={`${config.getApiEndpoint(
                      `getimage/${productVideo[0].split("/").pop()}`,
                      "get"
                    )}`}
                    style={{ width: "100px", height: "100px" }}
                    controls
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography>รูปเพิ่มเติม (ไม่เกิน 8 รูป)</Typography>
              <Button
                startIcon={<AddPhotoAlternateIcon />}
                color="info"
                onClick={() => {
                  setIsOpen({
                    isOpen: true,
                    imageSelect: 8,
                    selectImage: selectImage,
                    imageType: "image",
                    setStateImage: setSelectImage,
                  });
                }}
                variant="contained"
              >
                เลือกรูปภาพเพิ่มเติม
              </Button>
              {selectImage.length > 0 && (
                <Button
                  color="error"
                  sx={{
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setSelectImage([]);
                  }}
                  variant="contained"
                >
                  <ClearIcon />
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <Container style={{ overflowX: "auto" }}>
                <Stack direction="row" spacing={2}>
                  {selectImage.map((image, index) => (
                    <Stack>
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        <img
                          src={`${config.getApiEndpoint(
                            `getimage/${image.split("/").pop()}`,
                            "get"
                          )}`}
                          alt={`additionalImage-${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            margin: "5px",
                            cursor: "pointer",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          onClick={() => handleOpenDialog(index)}
                        />
                      </div>
                    </Stack>
                  ))}
                </Stack>
              </Container>
            </Grid>
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
                {allStandard.map((data, index) => {
                  if (
                    data.standard_name !== "ไม่มี" &&
                    data.standard_name !== "อื่นๆ"
                  ) {
                    return (
                      <>
                        <ListItem key={data.standard_id} disablePadding>
                          <ListItemButton dense>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                tabIndex={-1}
                                disableRipple
                                defaultChecked={
                                  selectedStandard.filter(
                                    (standard) =>
                                      standard.standard_id === data.standard_id
                                  ).length > 0
                                }
                                inputProps={{
                                  "aria-labelledby": data.standard_id,
                                }}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStandard([
                                      ...selectedStandard,
                                      {
                                        standard_id: data.standard_id,
                                        status: "pending",
                                        date_expired: new Date(),
                                        date_request: new Date(),
                                      },
                                    ]);
                                  } else {
                                    setSelectedStandard(
                                      selectedStandard.filter(
                                        (standard) =>
                                          standard.standard_id !==
                                          data.standard_id
                                      )
                                    );
                                  }
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText id={data.standard_id}>
                              <Typography>
                                {data.standard_name}{" "}
                                {selectedStandard.map((standard) => {
                                  if (
                                    standard.standard_id === data.standard_id
                                  ) {
                                    return (
                                      <Typography
                                        sx={{
                                          color:
                                            standard.status === "pending"
                                              ? "#FFA500"
                                              : "green",
                                        }}
                                      >
                                        {(standard.status === "pending" &&
                                          `(รอการอนุมัติ วันที่ขอ ${
                                            standard.date_request &&
                                            new Date(
                                              standard.date_request
                                            ).toLocaleDateString("th-TH", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                            })
                                          })`) ||
                                          (standard.status === "complete" &&
                                            `(อนุมัติแล้ว ${
                                              standard.date_recieve &&
                                              new Date(
                                                standard.date_recieve
                                              ).toLocaleDateString("th-TH", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                              })
                                            })`)}
                                      </Typography>
                                    );
                                  }
                                })}
                              </Typography>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem>
                        {selectedStandard.filter(
                          (standard) =>
                            standard.standard_id === data.standard_id
                        ).length > 0 && (
                          <>
                            <Typography variant="subtitle1">
                              วันหมดอายุใบรับรอง
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                disabled={
                                  selectedStandard.filter(
                                    (standard) =>
                                      standard.standard_id ===
                                        data.standard_id &&
                                      standard.status === "complete"
                                  ).length > 0
                                }
                                sx={{ width: "100%" }}
                                defaultValue={
                                  selectedStandard.filter(
                                    (standard) =>
                                      standard.standard_id === data.standard_id
                                  )[0].date_expired
                                    ? dayjs(
                                        selectedStandard.filter(
                                          (standard) =>
                                            standard.standard_id ===
                                            data.standard_id
                                        )[0].date_expired
                                      )
                                    : dayjs()
                                }
                                onChange={(e: any) => {
                                  setSelectedStandard(
                                    selectedStandard.map((standard) => {
                                      if (
                                        standard.standard_id ===
                                        data.standard_id
                                      ) {
                                        return {
                                          ...standard,
                                          date_expired: e.format("YYYY-MM-DD"),
                                        };
                                      } else {
                                        return standard;
                                      }
                                    })
                                  );
                                }}
                              />
                            </LocalizationProvider>
                          </>
                        )}
                      </>
                    );
                  }
                })}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                sx={{
                  border: 1,
                  borderRadius: 2,
                  padding: "10px",
                }}
              >
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      fontSize: "20px",
                    }}
                    variant="h6"
                  >
                    คำอธิบายรูปแบบการขาย
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ประชาสัมพันธ์
                  </Typography>
                  <Typography>
                    สินค้าที่เกษตรกรประชาสัมพันธ์เพื่อเป็นการโฆษณาสินค้า
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    จองสินค้าผ่านเว็บไซต์
                  </Typography>

                  <Typography>
                    เป็นการเก็บข้อมูลที่สมาชิกระบุจำนวนที่ต้องการจอง
                    และช่องทางการติดต่อ
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    paddingLeft: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    สินค้าจัดส่งพัสดุ
                  </Typography>
                  <Typography>
                    สินค้าที่เกษตรกรจัดส่งพัสดุให้กับลูกค้า ต้องระบุจำนวนสินค้า
                    หากสมาชิกสั่งซื้อสินค้าจะต้องระบุหมายเลขพัสดุเมื่อทำการจัดส่งแล้ว
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Typography
                    margin={2}
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    หมายเหตุ: หากไม่ต้องการให้สมาชิกสั่งซื้อสินค้า
                    โปรดเลือกประชาสัมพันธ์
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                value={selectedType}
                select
                fullWidth
                disabled={productid ? true : false}
                label="รูปแบบการขาย"
                required
                error={!checkType}
                helperText={!checkType && "กรุณาเลือกรูปแบบการขาย"}
              >
                {web_activity.map((activity) => (
                  <MenuItem
                    key={activity.activityID}
                    value={activity.activityName}
                    onClick={() => setSelectedType(activity.activityName)}
                  >
                    {activity.activityName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {selectedType == "ประชาสัมพันธ์" && (
              <React.Fragment>
                <Grid item xs={6} md={3}>
                  <TextField
                    value={price}
                    id="outlined-basic"
                    label="ราคา"
                    variant="outlined"
                    fullWidth
                    type="number"
                    required
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    fullWidth
                    error={!checkUnit || !regUnit}
                    helperText={
                      (!checkUnit && "กรุณากรอกหน่วยของสินค้า") ||
                      (!regUnit && "ห้ามใส่อักขระพิเศษ")
                    }
                    required
                  />
                </Grid>
              </React.Fragment>
            )}
            {selectedType == "จองสินค้าผ่านเว็บไซต์" && (
              <React.Fragment>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    value={selectedStatus}
                    label="สถานะการจอง"
                    onChange={handleReservationStatusChange}
                    required
                    error={!checkStatus}
                    helperText={!checkStatus && "กรุณาเลือกสถานะการจอง"}
                  >
                    {reservation_status.map((option) => (
                      <MenuItem key={option.statusID} value={option.statusName}>
                        {option.statusName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <TextField
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    fullWidth
                    error={!checkUnit || !regUnit}
                    helperText={
                      (!checkUnit && "กรุณากรอกหน่วยของสินค้า") ||
                      (!regUnit && "ห้ามใส่อักขระพิเศษ")
                    }
                    required
                  />
                </Grid>

                {selectedStatus == "เปิดรับจองตามช่วงเวลา" && (
                  <React.Fragment>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        วันเริ่มรับจอง
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: "100%" }}
                          defaultValue={startDate ? dayjs(startDate) : null}
                          onChange={(e: any) =>
                            setStartDate(e.format("YYYY-MM-DD"))
                          }
                        />
                      </LocalizationProvider>
                      {!checkstartDate && (
                        <Typography color="red">
                          กรุณาเลือกวันเริ่มรับจอง
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        วันสิ้นสุดการจอง
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: "100%" }}
                          defaultValue={endDate ? dayjs(endDate) : null}
                          minDate={
                            startDate
                              ? dayjs(startDate).add(1, "day")
                              : dayjs().add(1, "day")
                          }
                          onChange={(e: any) =>
                            setEndDate(e.format("YYYY-MM-DD"))
                          }
                        />
                      </LocalizationProvider>
                      {!checkendDate && (
                        <Typography color="red">
                          กรุณาเลือกวันสิ้นสุด
                        </Typography>
                      )}
                    </Grid>
                  </React.Fragment>
                )}
                {(selectedStatus == "เปิดรับจองตามช่วงเวลา" ||
                  selectedStatus == "เปิดรับจองตลอด") && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">
                      คาดการณ์เดือนที่ได้รับสินค้า
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ width: "100%" }}
                        defaultValue={
                          monthreceived ? dayjs(monthreceived) : null
                        }
                        onChange={(e: any) =>
                          setMonthreceived(e.format("YYYY-MM-DD"))
                        }
                      />
                    </LocalizationProvider>
                  </Grid>
                )}
              </React.Fragment>
            )}

            {selectedType == "สินค้าจัดส่งพัสดุ" && (
              <>
                <Grid item xs={8} lg={6}>
                  <TextField
                    id="outlined-basic"
                    value={price}
                    label="ราคา"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    InputProps={{
                      endAdornment: <Typography>บาท</Typography>,
                    }}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={8} lg={6}>
                  <TextField
                    id="outlined-basic"
                    label="น้ำหนัก"
                    value={weight}
                    placeholder="หน่วยกรัม (นำไปใช้ในการคำนวณค่าส่ง)"
                    type="number"
                    inputProps={{ min: weight > 0 }}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    InputProps={{
                      endAdornment: <Typography>กรัม</Typography>,
                    }}
                    error={!checkWeight}
                    helperText={!checkWeight && "น้ำหนักต้องมากกว่า 0 กรัม"}
                  />
                </Grid>
                <Grid item xs={4} lg={6}>
                  <TextField
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    fullWidth
                    error={!checkUnit || !regUnit}
                    helperText={
                      (!checkUnit && "กรุณากรอกหน่วยของสินค้า") ||
                      (!regUnit && "ห้ามใส่อักขระพิเศษ")
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="จำนวนคลังสินค้า"
                    value={stock}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography>{unit}</Typography>,
                    }}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginBottom: "10px",
              }}
            >
              <Button
                onClick={onSubmit}
                variant="contained"
                sx={{
                  marginRight: "10px",
                }}
                disabled={!productName || !coverImage || !selectedCategory}
              >
                ยืนยัน
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setIsExist(true);
                }}
              >
                ยกเลิก
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
};

export default AddProduct;
