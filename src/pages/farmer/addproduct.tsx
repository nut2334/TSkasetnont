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
import AddStandard from "../../components/addstandard";
import AddCarriage from "../../components/addcarriage";
import { reservation_status, web_activity } from "../../config/dataDropdown";
import * as config from "../../config/config";

const AddProduct = (prop: { jwt_token: string; username: string }) => {
  const apiAddProduct = config.getApiEndpoint("addproduct", "POST");
  const [productName, setProductName] = useState<string>("");
  const [checkProductName, setCheckProductName] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productVideo, setProductVideo] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [deposit, setDeposit] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedStandard, setSelectedStandard] = React.useState<
    {
      standard_id: string;
      standard_name: string;
      standard_number: string;
      standard_expire: Date | undefined;
      standard_cercification: File | undefined;
    }[]
  >([]);
  const [dataCarriage, setDataCarriage] = useState<
    {
      weight: number;
      price: number;
    }[]
  >([{ weight: 0, price: 0 }]);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    console.log(selectedStandard);
  }, [selectedStandard]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
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
    if (checkProductName) {
      const data = new FormData();
      //username
      data.append("username", prop.username);
      //ชื่อสินค้า
      data.append("productName", productName);
      //หมวดหมู่สินค้า
      console.log(selectedCategory);
      data.append("category", selectedCategory);
      //รายละเอียดสินค้า
      data.append("description", description);
      //รูปปก
      if (productImage) {
        data.append("productImage", productImage);
      }
      //วิดีโอ
      if (productVideo) {
        data.append("productVideo", productVideo);
      }
      //รูปเพิ่มเติม
      additionalImages.forEach((image) => {
        data.append("additionalImages", image);
      });
      //รูปแบบการเก็บข้อมูล
      data.append("selectedType", selectedType);
      //ราคา
      data.append("price", price.toString());
      //หน่วย
      data.append("unit", unit);
      //คลังสินค้า
      data.append("stock", stock.toString());
      //สถานะการจอง
      data.append("selectedStatus", selectedStatus);
      //วันเริ่มรับจอง
      if (startDate) {
        data.append("startDate", startDate);
      }
      //วันสิ้นสุดการจอง
      if (endDate) {
        data.append("endDate", endDate);
      }
      //ราคามัดจำ
      data.append("deposit", deposit.toString());
      //มาตรฐานสินค้า
      console.log(selectedStandard);
      data.append("selectedStandard", JSON.stringify(selectedStandard));
      //ใบรับรองมาตรฐานสินค้า
      selectedStandard.forEach((standard) => {
        if (standard.standard_cercification) {
          data.append("cercificationImage", standard.standard_cercification);
        } else {
          data.append("cercificationImage", "");
        }
      });
      //ค่าส่ง
      data.append("dataCarriage", JSON.stringify(dataCarriage));

      axios.post(apiAddProduct, data, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
    }
  };
  useEffect(() => {
    //console.log(dataCarriage);
  }, [dataCarriage]);

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
            <Grid item xs={12}>
              <AddStandard
                setSelectedStandard={setSelectedStandard}
                selectedStandard={selectedStandard}
              />
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

                  <Typography>
                    เป็นการเก็บข้อมูลที่สมาชิกระบุจำนวนที่ต้องการจอง
                    และช่องทางการติดต่อ
                  </Typography>
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
            <Grid item xs={12} lg={6}>
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
                <Grid item lg={6} xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="จำนวนคลังสินค้า"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setStock(parseInt(e.target.value))}
                  />
                </Grid>
                <AddCarriage unit={unit} setDataCarriage={setDataCarriage} />
              </>
            )}
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
      </Container>
    </React.Fragment>
  );
};

export default AddProduct;
