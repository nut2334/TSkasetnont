import {
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { Cart } from "../../App";
import TableBank from "../../components/tablebank";
import axios from "axios";
import * as config from "../../config/config";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
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
interface productInterface {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}
const Payment = (prop: {
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
  cartList: Cart[];
  jwt_token: string;
  shippingcost: number;
}) => {
  const [address, setAddress] = React.useState<string>("");
  const [payment, setPayment] = React.useState<string>("");
  const [products, setProducts] = React.useState<productInterface[]>([]);
  const [checkAddress, setCheckAdress] = React.useState<boolean>(true);
  const [slip, setSlip] = React.useState<File | null>(null);
  const [redirect, setRedirect] = React.useState<boolean>(false);
  const cliclChangeAddress = () => {
    setCheckAdress(!checkAddress);
  };
  useEffect(() => {
    let products: productInterface[] = [];
    prop.cartList.forEach((product) => {
      products.push({
        product_id: product.product_id,
        product_name: product.product_name,
        product_image: "",
        quantity: product.quantity,
        price: product.price,
      });
    });
    setProducts(products);
  }, [prop.cartList]);

  useEffect(() => {
    const apiGetinfo = config.getApiEndpoint("getinfo", "GET");
    axios
      .get(apiGetinfo, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAddress(res.data.address);
      })
      .catch((err) => {
        console.log(err);
      });

    const apiPayment = config.getApiEndpoint(
      `getpayment/${prop.cartList[0].product_id}`,
      "GET"
    );
    axios
      .post(apiPayment)
      .then((res) => {
        console.log(res.data);
        setPayment(res.data.payment);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSubmit = () => {
    if (slip === null) {
      Swal.fire({
        title: "กรุณาเลือกสลิปการโอนเงิน",
        icon: "error",
      });
      return;
    }
    Swal.fire({
      title: "ยืนยันการชำระเงิน",
      text: "คุณต้องการยืนยันการชำระเงินใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังดำเนินการ",
          icon: "info",
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        const formData = new FormData();
        formData.append("image", slip);
        formData.append("address", address);
        formData.append("shippingcost", prop.shippingcost.toString());
        let allProduct = prop.cartList.map((product) => {
          return {
            product_id: product.product_id,
            amount: product.quantity,
          };
        });
        formData.append("cartList", JSON.stringify(allProduct));
        //log formdata
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        axios
          .post(config.getApiEndpoint("checkout", "POST"), formData, {
            headers: {
              Authorization: `Bearer ${prop.jwt_token}`,
            },
          })
          .then(() => {
            Swal.fire({
              title: "สำเร็จ",
              text: "ทำการสั่งซื้อสำเร็จ",
              icon: "success",
            });
            prop.setCartList([]);
            setRedirect(true);
          })
          .catch((err) => {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "กรุณาลองใหม่อีกครั้ง",
              icon: "error",
            });
          });
      }
    });
  };
  if (redirect) {
    return <Navigate to="/orderlist" />;
  }

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">ทำการสั่งซื้อ</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              disabled={checkAddress}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              label={(() => {
                return (
                  <div>
                    <FmdGoodIcon color="success" />
                    ที่อยู่สำหรับจัดส่ง
                  </div>
                );
              })()}
              value={address}
            ></TextField>
          </Grid>

          {checkAddress && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={cliclChangeAddress}
              >
                เปลี่ยนที่อยู่
              </Button>
            </Grid>
          )}

          {!checkAddress && (
            <Grid item xs={12}>
              <Button variant="contained" onClick={cliclChangeAddress}>
                ยืนยันที่อยู่
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">รายการสินค้า</Typography>
            <TableBank
              products={products}
              shippingcost={Number(prop.shippingcost)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            <Typography variant="h6">ช่องทางการชำระเงิน</Typography>
            <Typography>{payment}</Typography>

            <Button
              component="label"
              variant="contained"
              color="info"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                marginTop: "10px",
              }}
            >
              อัพโหลดสลิปการโอนเงิน
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                id="upload-slip"
                name="upload-slip"
                onChange={(e) => {
                  if (e.target.files && e.target.files?.length > 0) {
                    setSlip(e.target.files[0]);
                  } else {
                    setSlip(null);
                  }
                }}
              />
            </Button>
            {slip && (
              <Typography
                sx={{
                  marginTop: "10px",
                }}
              >
                <img src={URL.createObjectURL(slip)} alt="slip" width="100" />
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              ยืนยันการชำระเงิน
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Payment;
