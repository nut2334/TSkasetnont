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
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import DropdownCatagory from "../../components/dropdownCatagory";
import AddStandard from "../../components/addstandard";
import AddCarriage from "../../components/addcarriage";
import { reservation_status, web_activity } from "../../config/dataDropdown";
import * as config from "../../config/config";
import { useParams } from "react-router-dom";
import Imagestore from "../../components/imagestore";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

const AddProduct = (prop: { jwt_token: string; username: string }) => {
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
  const [price, setPrice] = useState<number>();
  const [unit, setUnit] = useState<string>("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState<string>();

  const [checkStandard, setCheckStandard] = useState<boolean>(true);
  const [selectedStandard, setSelectedStandard] = React.useState<
    {
      standard_id: string;
      standard_name: string;
      standard_number: string;
      standard_expire: Date | undefined;
      standard_cercification: string | undefined;
    }[]
  >([
    {
      standard_id: "",
      standard_name: "",
      standard_number: "",
      standard_expire: undefined,
      standard_cercification: undefined,
    },
  ]);
  const [shippingcost, setShippingCost] = useState<
    {
      weight: number;
      price: number;
    }[]
  >([{ weight: 0, price: 0 }]);
  const [stock, setStock] = useState<number>(0);
  const { productid, shopname } = useParams<{
    productid: string;
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
        console.log(res.data);
        setProductName(res.data.product_name);
        setSelectedCategory(res.data.category_id);
        setDescription(res.data.product_description);
        setSelectedType(res.data.selectedType);
        setPrice(res.data.price);
        setUnit(res.data.unit);
        setStock(res.data.stock);
        setSelectedStatus(res.data.selectedStatus);
        setStartDate(res.data.startDate);
        setEndDate(res.data.endDate);
        setCoverImage([res.data.product_image]);
        setProductVideo(res.data.product_video ? [res.data.product_video] : []);
        setSelectImage(
          res.data.additional_image ? JSON.parse(res.data.additional_image) : []
        );
        setSelectedStandard(JSON.parse(res.data.certificate));
        setShippingCost(JSON.parse(res.data.shippingcost));
      });
    }
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
    }
  };
  const onSubmit = () => {
    if (productName == "") {
      setCheckProductName(false);
    }
    if (selectedCategory == "") {
      setCheckCategory(false);
    }
    if (selectedType == "") {
      setCheckType(false);
    }
    if (coverImage.length == 0) {
      setCheckCoverImage(false);
    }
    if (selectedStandard.length == 0) {
      setCheckStandard(false);
    }
    if (checkProductName) {
      let body = {
        product_name: productName,
        category_id: selectedCategory,
        product_description: description,
        selectedType: selectedType,
        price: price,
        unit: unit,
        stock: stock,
        selectedStatus: selectedStatus,
        startDate: startDate,
        endDate: endDate,
        product_image: coverImage[0],
        product_video: productVideo[0],
        additional_images: JSON.stringify(selectImage),
        certificate: JSON.stringify(selectedStandard),
        shippingcost: JSON.stringify(shippingcost),
      } as any;

      if (productid) {
        body = {
          ...body,
          product_id: productid,
        };
      }

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
            text: "ต้องการเพิ่มสินค้าเพิ่มเติมหรือไม่",
            showCancelButton: true,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่",
          }).then((result) => {
            if (result.isConfirmed) {
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
              setSelectedStandard([
                {
                  standard_id: "",
                  standard_name: "",
                  standard_number: "",
                  standard_expire: undefined,
                  standard_cercification: undefined,
                },
              ]);
              setShippingCost([{ weight: 0, price: 0 }]);
              setSelectedType("");
            }
            if (result.isDismissed) {
              setIsExist(true);
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "บันทึกข้อมูลไม่สำเร็จ",
            text: "กรุณากรอกข้อมูลให้ครบถ้วน",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }
  };
  if (isExist) {
    return <Navigate to="/myproducts" />;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 5,
            marginBottom: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "green" }}>
            <AddBusinessIcon />
          </Avatar>
          <Typography variant="h5">เพิ่มสินค้า</Typography>
        </Box>
        <form>
          <Grid container spacing={2} sx={{ marginBottom: 1 }}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
                {selectImage.map((image, index) => (
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
                ))}
              </Container>
            </Grid>
            <AddStandard
              setSelectedStandard={setSelectedStandard}
              selectedStandard={selectedStandard}
              jwt_token={prop.jwt_token}
              checkStandard={checkStandard}
            />
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
                    คำอธิบายรูปแบบการเก็บข้อมูล
                  </Typography>
                </Grid>
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                  xs={4}
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
                  <Typography>
                    หากไม่ต้องการให้สมาชิกสั่งซื้อสินค้า โปรดเลือกประชาสัมพันธ์
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                value={selectedType}
                select
                fullWidth
                label="รูปแบบการเก็บข้อมูล"
                required
                error={!checkType}
                helperText={!checkType && "กรุณาเลือกรูปแบบการเก็บข้อมูล"}
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
                <Grid item xs={4}>
                  <TextField
                    value={price}
                    id="outlined-basic"
                    label="ราคา"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    value={unit}
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    onChange={(e) => setUnit(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </React.Fragment>
            )}
            {selectedType == "จองสินค้าผ่านเว็บไซต์" && (
              <React.Fragment>
                <Grid item xs={6}>
                  <TextField
                    value={price}
                    id="outlined-basic"
                    label="ราคามัดจำ"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="สถานะการจอง"
                    onChange={handleReservationStatusChange}
                  >
                    {reservation_status.map((option) => (
                      <MenuItem key={option.statusID} value={option.statusName}>
                        {option.statusName}
                      </MenuItem>
                    ))}
                  </TextField>
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
                          onChange={(e: any) =>
                            setStartDate(e.format("YYYY-MM-DD"))
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        วันสิ้นสุดการจอง
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: "100%" }}
                          onChange={(e: any) =>
                            setEndDate(e.format("YYYY-MM-DD"))
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                  </React.Fragment>
                )}
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </React.Fragment>
            )}
            {selectedType == "สินค้าจัดส่งพัสดุ" && (
              <>
                <Grid item xs={8} lg={6}>
                  <TextField
                    id="outlined-basic"
                    label="ราคา"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={4} lg={6}>
                  <TextField
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    onChange={(e) => setUnit(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="จำนวนคลังสินค้า"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    type="number"
                  />
                </Grid>
                <AddCarriage unit={unit} setShippingCost={setShippingCost} />
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
                variant="contained"
                color="error"
                onClick={() => {
                  setIsExist(true);
                }}
                sx={{
                  marginRight: "10px",
                }}
              >
                ยกเลิก
              </Button>

              <Button onClick={onSubmit} variant="contained">
                ยืนยัน
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
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
    </React.Fragment>
  );
};

export default AddProduct;
