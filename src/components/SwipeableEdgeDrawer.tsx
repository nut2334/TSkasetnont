import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Container, Grid, Stack } from "@mui/material";
import axios from "axios";
import * as config from "../config/config";
import StoreIcon from "@mui/icons-material/Store";
import { NavLink, Navigate } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import { RWebShare } from "react-web-share";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { Rating } from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { Cart } from "../App";
import { Link } from "react-router-dom";

const drawerBleeding = 56;

interface Props {
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function SwipeableEdgeDrawer(
  props: Props & {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProduct: {
      product_id: string;
      product_name: string;
      product_description: string;
      price: string;
      product_image: string;
      category_id: string;
      lat: string;
      lng: string;
      farmerstorename: string;
      unit: string;
      selectedType: string;
      stock: string;
      farmer_id: string;
      weight: string;
      shippingcost: string;
    };
    jwt_token: string;
    cartList: Cart[];
    setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
  }
) {
  const [average, setAverage] = React.useState<number>(0);
  const [goCart, setGoCart] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.selectedProduct.product_id === "") return;
    console.log(props.selectedProduct.product_id);
    const apiComment = config.getApiEndpoint(
      `getcomment/${props.selectedProduct.product_id}`,
      "get"
    );
    axios.get(apiComment).then((response) => {
      let average = response.data.reviews.reduce(
        (acc: number, current: { rating: number }) => acc + current.rating,
        0
      );
      average = average / response.data.reviews.length;
      console.log(average);
      setAverage(average);
    });
  }, [props.selectedProduct.product_id]);

  const { window } = props;
  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const toggleDrawer = (newOpen: boolean) => () => {
    props.setOpen(newOpen);
    console.log(props.selectedProduct);
  };

  if (goCart) {
    return <Navigate to="/listcart" />;
  }

  return (
    <Root>
      <Box>
        <CssBaseline />
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          }}
        />

        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={props.open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              {props.selectedProduct.farmerstorename || "ของเด็ดเกษตรนนท์"}
            </Typography>
          </StyledBox>
          <StyledBox
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
            }}
          >
            {
              <Grid container spacing={2} padding={2}>
                <Grid item md={6} sm={12}>
                  <img
                    src={`${config.getApiEndpoint(
                      `getimage/${props.selectedProduct.product_image
                        .split("/")
                        .pop()}`,
                      "get"
                    )}`}
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      borderRadius: "25px",
                      objectFit: "cover",
                    }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="h4" gutterBottom>
                        {props.selectedProduct.product_name}
                      </Typography>
                    </Grid>
                    {props.selectedProduct.selectedType ===
                      "สินค้าจัดส่งพัสดุ" && (
                      <Grid item xs={12}>
                        {
                          <div>
                            {!isNaN(average) && (
                              <Typography variant="h6" gutterBottom>
                                คะแนนเฉลี่ย {average.toFixed(1)}
                              </Typography>
                            )}
                            <Rating
                              value={average}
                              readOnly
                              precision={0.5}
                              size="large"
                            />
                          </div>
                        }
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        {props.selectedProduct.product_description}
                      </Typography>
                    </Grid>
                    {props.selectedProduct.selectedType ===
                      "สินค้าจัดส่งพัสดุ" && (
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          ราคา {props.selectedProduct.price} บาท /{" "}
                          {props.selectedProduct.unit}
                        </Typography>
                      </Grid>
                    )}

                    <Stack spacing={2} direction="row">
                      {props.selectedProduct.selectedType ===
                        "สินค้าจัดส่งพัสดุ" && (
                        <Stack>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<PointOfSaleIcon />}
                              disabled={
                                props.jwt_token == ""
                                  ? true
                                  : (
                                      jwtDecode(props.jwt_token) as {
                                        role: string;
                                      }
                                    ).role !== "members" ||
                                    props.selectedProduct.stock === "0" ||
                                    !(
                                      jwtDecode(props.jwt_token) as {
                                        activate: boolean;
                                      }
                                    ).activate
                              }
                              onClick={() => {
                                if (props.cartList.length === 0) {
                                  props.setCartList([
                                    {
                                      product_id:
                                        props.selectedProduct.product_id,
                                      product_name:
                                        props.selectedProduct.product_name,
                                      price: parseFloat(
                                        props.selectedProduct.price
                                      ),
                                      quantity: 1,
                                      farmer_id:
                                        props.selectedProduct.farmer_id,
                                      weight: parseFloat(
                                        props.selectedProduct.weight
                                      ),
                                      shippingcost:
                                        props.selectedProduct.shippingcost,
                                      stock: parseInt(
                                        props.selectedProduct.stock
                                      ),
                                    },
                                  ]);
                                  setGoCart(true);
                                  return;
                                }

                                if (
                                  props.cartList.find(
                                    (cart) =>
                                      cart.product_id ===
                                      props.selectedProduct.product_id
                                  )
                                ) {
                                  props.setCartList((prev) =>
                                    prev.map((cart) =>
                                      cart.product_id ===
                                      props.selectedProduct.product_id
                                        ? {
                                            ...cart,
                                            quantity: cart.quantity + 1,
                                          }
                                        : cart
                                    )
                                  );
                                  return;
                                }
                                if (
                                  props.selectedProduct.farmer_id !==
                                  props.cartList[0].farmer_id
                                ) {
                                  Swal.fire({
                                    icon: "question",
                                    title: "คุณต้องการเปลี่ยนร้านค้าหรือไม่",
                                    text: "หากต้องการเปลี่ยนร้านค้า รายการสินค้าในตะกร้าจะถูกลบทิ้ง",
                                    showCancelButton: true,
                                    confirmButtonText: "ใช่",
                                    cancelButtonText: "ไม่",
                                    focusConfirm: false,
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      props.setCartList([
                                        {
                                          product_id:
                                            props.selectedProduct.product_id,
                                          product_name:
                                            props.selectedProduct.product_name,
                                          price: parseFloat(
                                            props.selectedProduct.price
                                          ),
                                          quantity: 1,
                                          farmer_id:
                                            props.selectedProduct.farmer_id,
                                          weight: parseFloat(
                                            props.selectedProduct.weight
                                          ),
                                          shippingcost:
                                            props.selectedProduct.shippingcost,
                                          stock: parseInt(
                                            props.selectedProduct.stock
                                          ),
                                        },
                                      ]);
                                      setGoCart(true);
                                    }
                                  });
                                  return;
                                }
                              }}
                            >
                              ซื้อสินค้า
                            </Button>
                          </Grid>
                        </Stack>
                      )}
                      {props.selectedProduct.selectedType ===
                        "จองสินค้าผ่านเว็บไซต์" && (
                        <Stack>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<PointOfSaleIcon />}
                              disabled={
                                props.jwt_token == ""
                                  ? true
                                  : (
                                      jwtDecode(props.jwt_token) as {
                                        role: string;
                                      }
                                    ).role !== "members" ||
                                    !(
                                      jwtDecode(props.jwt_token) as {
                                        activate: boolean;
                                      }
                                    ).activate
                              }
                              sx={{
                                marginBottom: "10px",
                              }}
                              onClick={() => {
                                if (props.jwt_token == "") {
                                  Swal.fire({
                                    icon: "info",
                                    title: "กรุณาเข้าสู่ระบบ",
                                    showConfirmButton: false,
                                    timer: 1500,
                                  });
                                  return;
                                }
                                Swal.fire({
                                  title: "จองสินค้า",
                                  html: `จำนวน <input type="number" id="quantity" min="1" value="1"> ${props.selectedProduct.unit}
                                          <br/>Line ID <input type="text" id="lineid">`,
                                  showCancelButton: true,
                                  confirmButtonText: "จอง",
                                  cancelButtonText: "ยกเลิก",
                                  focusConfirm: false,
                                  preConfirm: () => {
                                    const quantity = document.getElementById(
                                      "quantity"
                                    ) as HTMLInputElement;
                                    const lineId = document.getElementById(
                                      "lineid"
                                    ) as HTMLInputElement;

                                    // ตรวจสอบว่ามีข้อมูลใน input ทั้งหมดหรือไม่
                                    if (!quantity.value || !lineId.value) {
                                      Swal.showValidationMessage(
                                        "กรุณากรอกข้อมูลให้ครบทุกช่อง"
                                      );
                                    }

                                    // ตรวจสอบว่าเลขจำนวนไม่ติดลบ
                                    if (Number(quantity.value) < 0) {
                                      Swal.showValidationMessage(
                                        "กรุณากรอกจำนวนที่มากกว่าหรือเท่ากับ 1"
                                      );
                                    }

                                    // ตรวจสอบว่า Line ID ไม่เป็นภาษาไทย
                                    const thaiRegex = /[ก-๙]/;
                                    if (thaiRegex.test(lineId.value)) {
                                      Swal.showValidationMessage(
                                        "Line ID ต้องเป็นภาษาอังกฤษเท่านั้น"
                                      );
                                    }
                                  },
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    let quantity = document.getElementById(
                                      "quantity"
                                    ) as HTMLInputElement;
                                    let lineid = document.getElementById(
                                      "lineid"
                                    ) as HTMLInputElement;
                                    const apiReserve = config.getApiEndpoint(
                                      `reserve`,
                                      "post"
                                    );
                                    axios
                                      .post(
                                        apiReserve,
                                        {
                                          quantity: quantity.value,
                                          lineid: lineid.value,
                                          product_id:
                                            props.selectedProduct.product_id,
                                        },
                                        {
                                          headers: {
                                            Authorization: `Bearer ${props.jwt_token}`,
                                          },
                                        }
                                      )
                                      .then(() => {
                                        Swal.fire({
                                          icon: "success",
                                          title: "จองสินค้าสำเร็จ",
                                          showConfirmButton: false,
                                          timer: 1500,
                                        });
                                      })
                                      .catch((error) => {
                                        console.log(error);
                                        Swal.fire({
                                          icon: "error",
                                          title: error.response.data.message,
                                          showConfirmButton: false,
                                          showCloseButton: true,
                                        });
                                      });
                                  }
                                });
                              }}
                            >
                              จองสินค้า
                            </Button>
                          </Grid>
                        </Stack>
                      )}
                      <Stack>
                        <Grid item md={12} sm={12}>
                          <NavLink
                            to={`/shop/${props.selectedProduct.farmerstorename}/${props.selectedProduct.product_id}`}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<StoreIcon />}
                              sx={{
                                marginBottom: "10px",
                              }}
                            >
                              เยี่ยมชมสินค้า
                            </Button>
                          </NavLink>
                        </Grid>
                      </Stack>
                    </Stack>
                    <Grid item md={12} sm={12}>
                      <RWebShare
                        data={{
                          text: `https://www.google.com/maps/search/?api=1&query=${props.selectedProduct.lat},${props.selectedProduct.lng}`,
                          url: `https://www.google.com/maps/search/?api=1&query=${props.selectedProduct.lat},${props.selectedProduct.lng}`,
                          title: props.selectedProduct.product_name,
                        }}
                        onClick={() => console.log("shared successfully!")}
                      >
                        <ShareIcon />
                      </RWebShare>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            }
          </StyledBox>
        </SwipeableDrawer>
      </Box>
    </Root>
  );
}
