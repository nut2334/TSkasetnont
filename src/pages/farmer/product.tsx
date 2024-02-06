import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  Avatar,
  TextField,
  Divider,
  InputAdornment,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import DropdownCatagory from "../../components/dropdownCatagory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface StandardProduct {
  standard_id: string;
  standard_name: string;
  expire: boolean;
}

const Product = (prop: { jwt_token: string; username: string }) => {
  const [productName, setProductName] = useState<string>("");
  const [checkProductName, setCheckProductName] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productVideo, setProductVideo] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypeDescription, setSelectedTypeDescription] =
    useState<string>("");
  const [standardproducts, setStandardproducts] = useState<StandardProduct[]>(
    []
  );
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [isStandardDate, setIsStandardDate] = useState<boolean>(true);
  const [standardName, setStandardName] = useState<string>("");
  const [standardNumber, setStandardNumber] = useState<string>("");
  const [exp, setExp] = useState(null);
  const [certification, setCertification] = useState<File | null>(null);
  const [openCertificationDialog, setOpenCertificationDialog] =
    useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [shippingCostList, setShippingCostList] = useState<any[]>([]);
  const [stock, setStock] = useState<number>(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [deposit, setDeposit] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);

  const reservation_status = [
    {
      statusID: "reservationOpenAlways",
      statusName: "เปิดรับจองตลอด",
    },
    {
      statusID: "reservationOpenPeriod",
      statusName: "เปิดรับจองตามช่วงเวลา",
    },
    {
      statusID: "reservationClose",
      statusName: "ปิดรับจอง",
    },
  ];

  const web_activity = [
    {
      activityID: "activity01",
      activityName: "ประชาสัมพันธ์",
    },
    {
      activityID: "activity02",
      activityName: "จองสินค้าผ่านเว็บไซต์",
      description: [
        "เก็บข้อมูลการติดต่อของลูกค้าเพียงอย่างเดียว",
        "เกษตรกรและลูกค้าสามารถนัดหมายวันเวลาได้",
      ],
    },
    {
      activityID: "activity03",
      activityName: "สินค้าจัดส่งพัสดุ",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/standardproducts");
      const data = await response.json();
      setStandardproducts(data);
    };
    fetchData();
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategoryName = event.target.value;
    if (selectedCategoryName) {
      setSelectedCategory(selectedCategoryName);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleProductVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductVideo(e.target.files[0]);
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      if (additionalImages.length < 8) {
        setAdditionalImages([...additionalImages, selectedImage]);
      } else {
        alert("ไม่สามารถเพิ่มรูปภาพเพิ่มเติมได้ รูปภาพไม่ควรเกิน 8 รูป");
      }
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const updatedImages = [...additionalImages];
    updatedImages.splice(index, 1);
    setAdditionalImages(updatedImages);
  };

  const handleOpenDialog = (index: number) => {
    setCurrentImageIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStandardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStandardName = event.target.value;
    const name = standardproducts.find(
      (option) => option.standard_name === selectedStandardName
    );
    if (name) {
      setSelectedStandard(name.standard_name);
      setIsStandardDate(name.expire);
    }
  };

  const handleExpChange = (date: any) => {
    setExp(date.format("YYYY-MM-DD"));
  };

  const handleCertificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
    }
  };

  const handleRemoveCertification = () => {
    setCertification(null);
    setOpenCertificationDialog(false);
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

  const addShippingCost = () => {
    setShippingCostList([
      ...shippingCostList,
      { amount: 0, unit: "", price: 0 },
    ]);
  };
  const deleteShippingCost = () => {
    const updatedCost = [...shippingCostList];
    updatedCost.pop();
    setShippingCostList(updatedCost);
  };
  const onSubmit = () => {
    if (productName == "") {
      setCheckProductName(false);
    }
    if (checkProductName) {
      // const data = {
      //   //username
      //   username: prop.username,
      //   //ชื่อสินค้า
      //   productName: productName,
      //   //หมวดหมู่สินค้า
      //   category: selectedCategory,
      //   //รายละเอียดสินค้า
      //   description: description,
      //   //รูปปก
      //   productImage: productImage,
      //   //วิดีโอ
      //   productVideo: productVideo,
      //   //รูปเพิ่มเติม
      //   additionalImages: additionalImages,
      //   //มาตรฐานที่ได้รับ
      //   selectedStandard: selectedStandard,
      //   //ชื่อมาตรฐาน
      //   standardName: standardName,
      //   //หมายเลขมาตรฐาน
      //   standardNumber: standardNumber,
      //   //ใบรับรอง
      //   certification: certification,
      //   //วันหมดอายุ
      //   exp: exp,
      //   //รูปแบบสินค้า
      //   selectedType: selectedType,
      //   //ราคา
      //   price: price,
      //   //หน่วย
      //   unit: unit,
      //   //คลังสินค้า
      //   stock: stock,
      //   //จำนวนสินค้าตอนคำนวณราคาจัดส่ง
      //   amount: amount,
      //   //ค่าส่ง 1 หน่วย
      //   shippingCost: shippingCost,
      //   //รายการค่าส่งอื่นๆ
      //   shippingCostList: shippingCostList,
      //   //สถานะการจอง
      //   selectedStatus: selectedStatus,
      //   //วันเริ่มรับจอง
      //   startDate: startDate,
      //   //วันสิ้นสุดการจอง
      //   endDate: endDate,
      //   //ราคามัดจำ
      //   deposit: deposit,
      // };
      // console.log(data);
      const data = new FormData();
      data.append("username", prop.username);
      data.append("productName", productName);
      data.append("category", selectedCategory);
      data.append("description", description);
      if (productImage) {
        data.append("productImage", productImage);
      }
      if (productVideo) {
        data.append("productVideo", productVideo);
      }
      additionalImages.forEach((image) => {
        data.append("additionalImages", image);
      });
      data.append("selectedStandard", selectedStandard);
      data.append("standardName", standardName);
      data.append("standardNumber", standardNumber);
      if (certification) {
        data.append("certification", certification);
      }
      if (exp) {
        data.append("exp", exp);
      }
      data.append("selectedType", selectedType);
      data.append("price", price.toString());
      data.append("unit", unit);
      data.append("stock", stock.toString());
      data.append("amount", amount.toString());
      data.append("shippingCost", shippingCost.toString());
      shippingCostList.forEach((cost) => {
        data.append("shippingCostList", cost);
      });
      data.append("selectedStatus", selectedStatus);
      if (startDate) {
        data.append("startDate", startDate);
      }
      if (endDate) {
        data.append("endDate", endDate);
      }
      data.append("deposit", deposit.toString());

      axios.post("http://localhost:3001/addproduct", data, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
    }
  };

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
          <Typography component="h1" variant="h5">
            เพิ่มสินค้า
          </Typography>
        </Box>
        <form>
          <Grid container spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={6}>
              <TextField
                id="outlined-basic"
                label="ชื่อสินค้า"
                variant="outlined"
                fullWidth
                onChange={(e) => setProductName(e.target.value)}
                error={!checkProductName}
                helperText={!checkProductName && "กรุณากรอกชื่อสินค้า"}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <DropdownCatagory handleCategoryChange={handleCategoryChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="รายละเอียดสินค้า"
                type="text"
                multiline
                fullWidth
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <AddPhotoAlternateIcon
                  sx={{ marginRight: "5px" }}
                  color="primary"
                />
                รูปปก
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
              />
              {productImage && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(productImage)}
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
              <Typography>
                <VideoFileIcon sx={{ marginRight: "5px" }} color="primary" />
                วิดีโอ
              </Typography>
              <input
                type="file"
                accept="video/*"
                onChange={handleProductVideoChange}
              />
              {productVideo && (
                <div style={{ marginTop: "10px" }}>
                  <video
                    src={URL.createObjectURL(productVideo)}
                    style={{ width: "100px", height: "100px" }}
                    controls
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <AddPhotoAlternateIcon
                  sx={{ marginRight: "5px" }}
                  color="primary"
                />
                รูปเพิ่มเติม (ไม่เกิน 8 รูป)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleAdditionalImagesChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Container style={{ overflowX: "auto" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {additionalImages.slice(0, 8).map((image, index) => (
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
                        src={image && URL.createObjectURL(image)}
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
                </div>
              </Container>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/*มาตรฐานที่ได้รับ*/}
            <Grid item xs={6}>
              <TextField
                id="outlined-select-currency"
                select
                label="มาตรฐานที่ได้รับ"
                value={selectedStandard ? selectedStandard : ""}
                onChange={handleStandardChange}
                fullWidth
              >
                {standardproducts.map((option) => (
                  <MenuItem
                    key={option.standard_id}
                    value={option.standard_name}
                  >
                    {option.standard_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {selectedStandard != "ไม่มี" && selectedStandard && (
              <React.Fragment>
                {selectedStandard == "อื่นๆ" && (
                  <Grid item xs={6}>
                    <TextField
                      id="standardName"
                      label="ชื่อมาตรฐาน"
                      onChange={(e) => setStandardName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={6}>
                  <TextField
                    id="standardNumber"
                    label="หมายเลข"
                    onChange={(e) => setStandardNumber(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>ใบรับรอง</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCertificationChange}
                  />
                  {certification && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={URL.createObjectURL(certification)}
                        alt="certificationImage"
                        style={{
                          width: "100px",
                          height: "100px",
                          cursor: "pointer",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        onClick={() => setOpenCertificationDialog(true)}
                      />
                    </div>
                  )}
                </Grid>
                {/*ถ้ามีวันหมดอายุ*/}
                {isStandardDate && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">วันหมดอายุ</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ width: "100%" }}
                        onChange={handleExpChange}
                      />
                    </LocalizationProvider>
                  </Grid>
                )}
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <Button variant="contained" onClick={addShippingCost}>
                + เพิ่มมาตรฐาน
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                sx={{
                  border: 1,
                }}
              >
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    คำอธิบายรูปแบบสินค้า
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ borderRight: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    ประชาสัมพันธ์
                  </Typography>
                  <Typography>
                    สินค้าที่เกษตรกรประชาสัมพันธ์เพื่อเป็นการโฆษณาสินค้า
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ borderRight: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    จองสินค้าผ่านเว็บไซต์
                  </Typography>
                  {/* <Typography>
                    เก็บข้อมูลการติดต่อของลูกค้าเพียงอย่างเดียว
                  </Typography> */}
                  <Typography>
                    เป็นการเก็บข้อมูลที่สมาชิกระบุจำนวนที่ต้องการจอง
                    และช่องทางการติดต่อ
                  </Typography>
                  {/* <Typography>
                    เกษตรกรและลูกค้าสามารถนัดหมายวันเวลาได้
                  </Typography>
                  <Typography>
                    เป็นการเก็บข้อมูลที่สมาชิกระบุจำนวนที่ต้องการจอง
                    ช่องทางการติดต่อ
                    เกษตรกรและสมาชิกสามารถนัดหมายวันเวลาภายในเว็บไซต์ได้
                  </Typography> */}
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    สินค้าจัดส่งพัสดุ
                  </Typography>
                  <Typography>
                    สินค้าที่เกษตรกรจัดส่งพัสดุให้กับลูกค้า ต้องระบุจำนวนสินค้า
                    หากสมาชิกสั่งซื้อสินค้าจะต้องระบุหมายเลขพัสดุเมื่อทำการจัดส่งแล้ว
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    หากไม่ต้องการให้สมาชิกสั่งซื้อสินค้า โปรดเลือกประชาสัมพันธ์
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="รูปแบบสินค้า">
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
                    id="outlined-basic"
                    label="ราคา"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
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
                {/* <Grid item xs={6}>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                    >
                      {web_activity[1].description &&
                        web_activity[1].description.map((option) => (
                          <FormControlLabel
                            value={option}
                            control={<Radio />}
                            label={option}
                            onClick={() => setSelectedTypeDescription(option)}
                          />
                        ))}
                    </RadioGroup>
                  </FormControl>
                </Grid> */}
                <Grid item xs={6}>
                  <TextField
                    id="outlined-basic"
                    label="ราคามัดจำ"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setDeposit(parseInt(e.target.value))}
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
              <React.Fragment>
                <Grid item xs={4}>
                  <TextField
                    id="outlined-basic"
                    label="ราคา"
                    variant="outlined"
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="outlined-basic"
                    label="จำนวนคลังสินค้า"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setStock(parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>
                  <TextField
                    id="outlined-disabled"
                    label="กรัม"
                    variant="outlined"
                    fullWidth
                    defaultValue={0}
                    disabled
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArrowForwardIosIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id="outlined-basic"
                    label="หน่วย"
                    variant="outlined"
                    fullWidth
                    disabled
                    value={unit}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id="outlined-basic"
                    label="ค่าส่ง"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setShippingCost(parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button variant="contained" onClick={addShippingCost}>
                    +
                  </Button>
                </Grid>
                <Grid item xs={5}></Grid>
                {shippingCostList.map((cost, index) => (
                  <React.Fragment>
                    <Grid item xs={2}>
                      <TextField
                        id="outlined-basic"
                        label="กรัม"
                        variant="outlined"
                        fullWidth
                        key={index}
                        onChange={(e) => {
                          const updatedCost = [...shippingCostList];
                          updatedCost[index].amount = parseInt(e.target.value);
                          setShippingCostList(updatedCost);
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ArrowForwardIosIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        id="outlined-basic"
                        label="หน่วย"
                        variant="outlined"
                        fullWidth
                        value={unit}
                        key={index}
                        disabled
                        onChange={(e) => {
                          const updatedCost = [...shippingCostList];
                          updatedCost[index].unit = e.target.value;
                          setShippingCostList(updatedCost);
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        id="outlined-basic"
                        label="ค่าส่ง"
                        variant="outlined"
                        fullWidth
                        value={cost.price}
                        key={index}
                        onChange={(e) => {
                          const updatedCost = [...shippingCostList];
                          updatedCost[index].price = parseInt(e.target.value);
                          setShippingCostList(updatedCost);
                        }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button variant="contained" onClick={deleteShippingCost}>
                        -
                      </Button>
                    </Grid>
                    <Grid item xs={5}></Grid>
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
          <Button onClick={onSubmit} variant="contained">
            ยืนยัน
          </Button>
        </form>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent>
            <img
              src={
                additionalImages[currentImageIndex] &&
                URL.createObjectURL(additionalImages[currentImageIndex])
              }
              alt={`additionalImage-${currentImageIndex}`}
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              ปิด
            </Button>
            <Button
              onClick={() => handleRemoveAdditionalImage(currentImageIndex)}
              color="secondary"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              ลบรูปภาพ
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openCertificationDialog}
          onClose={() => setOpenCertificationDialog(false)}
        >
          <DialogContent>
            <img
              src={
                certification != null ? URL.createObjectURL(certification) : ""
              }
              alt="certificationImage"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenCertificationDialog(false)}
              color="primary"
            >
              ปิด
            </Button>
            <Button
              onClick={handleRemoveCertification}
              color="secondary"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              ลบรูปภาพ
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  );
};

export default Product;
