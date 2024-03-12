import React, { useEffect, useState, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import "./shop.css";
import {
  Button,
  Container,
  Typography,
  Stack,
  Box,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from "axios";
import * as config from "../../config/config";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Modal from "@mui/material/Modal";
import ShareIcon from "@mui/icons-material/Share";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { RWebShare } from "react-web-share";
import { NumberInput } from "../../components/addamount";
import StarIcon from "@mui/icons-material/Star";
import {
  FacebookShareButton,
  LineShareButton,
  FacebookIcon,
  LineIcon,
} from "react-share";
import { Cart } from "../../App";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Swal from "sweetalert2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useCopyToClipboard } from "usehooks-ts";

interface FullProductInterface {
  product_id: string;
  product_name: string;
  product_description: string;
  product_category: string;
  stock: number;
  price: number;
  unit: string;
  product_image: string;
  product_video: string | null;
  additional_image: string;
  view_count: number;
  campaign_id: string;
  last_modified: Date;
  selectedType: string;
  shippingcost: string;
  firstname: string;
  lastname: string;
  farmer_id: string;
  weight: number;
  address: string;
  certificate: string[];
  facebooklink: string;
  lineid: string;
  lat: number | undefined;
  lng: number | undefined;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxHeight: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const SigleProduct = (prop: {
  followList: { id: string; farmerstorename: string }[];
  setFollowList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        farmerstorename: string;
      }[]
    >
  >;
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
  cartList: Cart[];
  jwt_token: string;
}) => {
  const carousel = useRef<AliceCarousel>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<FullProductInterface>({
    product_id: "",
    product_name: "",
    product_description: "",
    product_category: "",
    stock: 0,
    price: 0,
    unit: "",
    product_image: "",
    product_video: "",
    additional_image: "",
    view_count: 0,
    campaign_id: "",
    last_modified: new Date(),
    selectedType: "",
    shippingcost: "",
    firstname: "",
    lastname: "",
    farmer_id: "",
    weight: 0,
    address: "",
    certificate: [],
    facebooklink: "",
    lineid: "",
    lat: undefined,
    lng: undefined,
  });
  const { productid, shopname } = useParams<{
    productid: string;
    shopname: string;
  }>();
  const [showFullImage, setShowFullImage] = useState("");
  const [comment, setComment] = useState<
    {
      review_id: string;
      member_id: string;
      product_id: string;
      order_id: string;
      rating: number;
      comment: string;
      date_comment: Date;
      member_username: string;
    }[]
  >([]);
  const [goCart, setGoCart] = useState(false);
  const [copiedText, copy] = useCopyToClipboard();
  const [allStandard, setAllStandard] = useState<
    {
      standard_name: string;
      standard_number: string;
      standard_expire: string;
      standard_cercification: string;
    }[]
  >([]);
  const [allStandardShow, setAllStandardShow] = useState<string[]>([]);

  useEffect(() => {
    const apiSingleProduct = config.getApiEndpoint(
      `getproduct/${encodeURI(shopname ? shopname : "")}/${productid}`,
      "get"
    );
    console.log(apiSingleProduct);

    axios.get(apiSingleProduct).then((response) => {
      setProduct(response.data);
      console.log(response.data);
    });

    const apiUpdateView = config.getApiEndpoint(
      `updateview/${productid}`,
      "get"
    );
    axios.get(apiUpdateView).catch((error) => {
      console.log(error);
    });
    console.log(prop.followList);
    axios
      .get(config.getApiEndpoint(`certiconver/${productid}`, "get"))
      .then((response) => {
        console.log(response.data);
        setAllStandardShow(response.data.standardNames);
      });
  }, []);

  useEffect(() => {
    const apiComments = config.getApiEndpoint(`getcomment/${productid}`, "get");
    axios.get(apiComments).then((response) => {
      setComment(response.data.reviews);
    });
    const apiAllStandard = config.getApiEndpoint(`standardproducts`, "get");
    axios.get(apiAllStandard).then((response) => {
      console.log(response.data);
      setAllStandard(response.data);
    });
  }, []);

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        console.log("Copied!", { text });
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
      });
  };

  const GenerateSlide = () => {
    let slides = [];
    if (product.product_image) {
      slides.push(
        <img
          src={`${config.getApiEndpoint(
            `getimage/${product.product_image.split("/").pop()}`,
            "get"
          )}`}
          className="sliderimg"
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
          }}
          onClick={() => {
            setShowFullImage(product.product_image);
          }}
          draggable="false"
        />
      );
    }
    if (product.additional_image) {
      slides.push(
        JSON.parse(product.additional_image.replace("\\", "")).map(
          (image: string) => (
            <img
              className="sliderimg"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
              src={
                image
                  ? `${config.getApiEndpoint(
                      `getimage/${image.split("/").pop()}`,
                      "get"
                    )}`
                  : ""
              }
              draggable="false"
              onClick={() => {
                setShowFullImage(image);
              }}
            />
          )
        )
      );
    }
    if (product.product_video) {
      slides.push(
        <video
          controls
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
          }}
        >
          <source
            src={`${config.getApiEndpoint(
              `getimage/${product.product_video.split("/").pop()}`,
              "get"
            )}`}
            type="video/mp4"
          />
        </video>
      );
    }

    return [].concat(...slides);
  };

  const GenerateSlideComputer = () => {
    let slides = [];
    if (product.product_image) {
      slides.push(
        <img
          src={`${config.getApiEndpoint(
            `getimage/${product.product_image.split("/").pop()}`,
            "get"
          )}`}
          className="sliderimg"
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
          }}
          onClick={() => {
            setShowFullImage(product.product_image);
          }}
          draggable="false"
        />
      );
    }
    if (product.additional_image) {
      slides.push(
        JSON.parse(product.additional_image.replace("\\", "")).map(
          (image: string) => (
            <img
              className="sliderimg"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
              }}
              src={`${config.getApiEndpoint(
                `getimage/${image.split("/").pop()}`,
                "get"
              )}`}
              draggable="false"
              onClick={() => {
                setShowFullImage(image);
              }}
            />
          )
        )
      );
    }
    if (product.product_video) {
      slides.push(
        <video
          controls
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
          }}
        >
          <source
            src={`${config.getApiEndpoint(
              `getimage/${product.product_video.split("/").pop()}`,
              "get"
            )}`}
            type="video/mp4"
          />
        </video>
      );
    }

    return [].concat(...slides);
  };

  const iconMarker = new Icon({
    iconUrl: require("../../assets/icon.svg").default,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -40],
  });

  if (goCart) {
    return <Navigate to="/listcart" />;
  }

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ position: "relative" }}>
        <Box display={{ xs: "none", lg: "flex" }}>
          <ArrowBackIosNewIcon
            sx={{
              position: "absolute",
              top: "40%",
              zIndex: 1,
              backgroundColor: "gray",
              color: "white",
              left: 20,
              padding: 1,
            }}
            onClick={(e) => carousel?.current?.slidePrev(e)}
          />
          <ArrowForwardIosIcon
            sx={{
              position: "absolute",
              zIndex: 1,
              top: "40%",
              backgroundColor: "gray",
              color: "white",
              right: 20,
              padding: 1,
            }}
            onClick={(e) => carousel?.current?.slideNext(e)}
          />
          <AliceCarousel
            key="carousel"
            disableButtonsControls
            mouseTracking
            infinite
            ref={carousel}
          >
            {GenerateSlideComputer()}
          </AliceCarousel>
        </Box>
        <Box display={{ xs: "flex", lg: "none" }}>
          <AliceCarousel
            key="carousel"
            mouseTracking
            disableButtonsControls
            infinite
            ref={carousel}
          >
            {GenerateSlide()}
          </AliceCarousel>
        </Box>
      </Box>
      <Typography variant="h4">
        {product.product_name}{" "}
        <div
          style={{
            color: "red",
          }}
        >
          {product.stock === 0 && product.selectedType == "สินค้าจัดส่งพัสดุ"
            ? `สินค้าหมด`
            : ""}
        </div>
      </Typography>
      {product.selectedType !== "จองสินค้าผ่านเว็บไซต์" && (
        <Typography
          variant="h6"
          sx={{
            color: "green",
          }}
        >
          {product.price} บาท/{product.unit}
        </Typography>
      )}

      <Stack
        direction="row"
        spacing={1}
        marginLeft={2}
        justifyContent="flex-end"
      >
        <Stack>
          <RemoveRedEyeIcon />
        </Stack>

        <Stack>
          <Typography variant="body1">{product.view_count}</Typography>
        </Stack>

        <Stack>
          <FacebookShareButton url={window.location.href}>
            <FacebookIcon
              style={{ borderRadius: "100%", width: 30, height: "auto" }}
            />
          </FacebookShareButton>
        </Stack>
        <Stack>
          <LineShareButton url={window.location.href}>
            <LineIcon
              style={{ borderRadius: "100%", width: 30, height: "auto" }}
            />
          </LineShareButton>
        </Stack>
        <Stack>
          <RWebShare
            data={{
              text: product.product_description,
              url: window.location.href,
              title: "ของเด็ดเกษตรนนท์",
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <ShareIcon />
          </RWebShare>
        </Stack>
      </Stack>
      <Divider
        sx={{
          marginBottom: 2,
          marginTop: 1,
        }}
      />
      <Typography variant="h6">รายละเอียดสินค้า</Typography>
      <Typography>{product.product_description}</Typography>

      {product.certificate.length > 0 && (
        <Box
          sx={{
            paddingTop: "10px",
          }}
        >
          <Typography variant="h6">มาตรฐาน</Typography>
          <Box
            sx={{
              padding: "10px",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                width: "100%",
                marginBottom: 2,
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อมาตรฐาน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allStandardShow.map((item) => {
                    return (
                      <TableRow key={item}>
                        <TableCell component="th" scope="row">
                          {item}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}

      {product.selectedType !== "ประชาสัมพันธ์" && (
        <>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              paddingTop: "5px",
            }}
            marginLeft={2}
          >
            {product.selectedType == "สินค้าจัดส่งพัสดุ" && (
              <>
                <Stack>
                  <NumberInput
                    aria-label="Quantity Input"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    setQuantity={setQuantity}
                    quantity={quantity}
                  />
                </Stack>
                <Stack>
                  <Typography>
                    มีสินค้าทั้งหมด {product.stock} {product.unit}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
          {product.selectedType == "สินค้าจัดส่งพัสดุ" && (
            <>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  paddingTop: "5px",
                }}
                marginLeft={2}
                marginTop={2}
              >
                <Stack>
                  <LocalShippingIcon />
                </Stack>

                <Stack>
                  <Typography variant="h6">ค่าจัดส่ง</Typography>
                </Stack>
              </Stack>
              <TableContainer
                component={Paper}
                sx={{
                  width: "200px",
                }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>น้ำหนัก</TableCell>
                      <TableCell align="right">ค่าส่ง</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.shippingcost &&
                      JSON.parse(product.shippingcost).map((item: any) => {
                        return (
                          <TableRow key={item.weight}>
                            <TableCell component="th" scope="row">
                              {">"}
                              {item.weight} กรัม
                            </TableCell>
                            <TableCell align="right">
                              {item.price} บาท
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Stack direction="row" spacing={2} justifyContent="end">
            {product.selectedType == "จองสินค้าผ่านเว็บไซต์" &&
              (prop.jwt_token == "" ||
                (jwtDecode(prop.jwt_token) as { role: string }).role ==
                  "members") && (
                <Stack>
                  <NavLink to={prop.jwt_token == "" ? "/login" : ""}>
                    <Button
                      disabled={
                        (jwtDecode(prop.jwt_token) as { role: string }).role !==
                        "members"
                      }
                      variant="contained"
                      color="secondary"
                      startIcon={<PointOfSaleIcon />}
                      onClick={() => {
                        if (prop.jwt_token == "") {
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
                          html: `จำนวน <input type="number" id="quantity" min="1" value="1"> ${product.unit}
                        <br/>Line ID <input type="text" id="lineid">
                        `,
                          showCancelButton: true,
                          confirmButtonText: "จอง",
                          cancelButtonText: "ยกเลิก",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            let quantity = (
                              document.getElementById(
                                "quantity"
                              ) as HTMLInputElement
                            ).value;
                            let lineid = (
                              document.getElementById(
                                "lineid"
                              ) as HTMLInputElement
                            ).value;
                            const apiReserve = config.getApiEndpoint(
                              `reserve`,
                              "post"
                            );
                            axios
                              .post(
                                apiReserve,
                                {
                                  quantity: quantity,
                                  lineid: lineid,
                                  product_id: product.product_id,
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${prop.jwt_token}`,
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
                  </NavLink>
                </Stack>
              )}
            {product.selectedType == "สินค้าจัดส่งพัสดุ" && (
              <>
                <Stack>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddShoppingCartIcon />}
                    disabled={
                      product.stock == 0 ||
                      (jwtDecode(prop.jwt_token) as { role: string }).role !==
                        "members"
                    }
                    onClick={() => {
                      if (prop.jwt_token == "") {
                        Swal.fire({
                          icon: "info",
                          title: "กรุณาเข้าสู่ระบบ",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        return;
                      }
                      console.log(prop.cartList, product.farmer_id);

                      if (
                        prop.cartList.length > 0 &&
                        product.farmer_id !==
                          prop.cartList.find(
                            (item) => item.farmer_id == product.farmer_id
                          )?.farmer_id
                      ) {
                        Swal.fire({
                          icon: "question",
                          title: "คุณต้องการเปลี่ยนร้านค้าหรือไม่",
                          text: "หากต้องการเปลี่ยนร้านค้า รายการสินค้าในตะกร้าจะถูกลบทิ้ง",
                          showDenyButton: true,
                          confirmButtonText: "ใช่",
                          denyButtonText: "ไม่",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            prop.setCartList([]);
                            let cart: Cart = {
                              product_id: product.product_id,
                              quantity: quantity,
                              product_name: product.product_name,
                              price: product.price,
                              stock: product.stock,
                              farmer_id: product.farmer_id,
                              weight: product.weight,
                              shippingcost: product.shippingcost,
                            };
                            prop.setCartList([cart]);
                          }
                        });
                      } else {
                        let cart: Cart = {
                          product_id: product.product_id,
                          quantity: quantity,
                          product_name: product.product_name,
                          price: product.price,
                          stock: product.stock,
                          farmer_id: product.farmer_id,
                          weight: product.weight,
                          shippingcost: product.shippingcost,
                        };
                        if (
                          prop.cartList.filter(
                            (item) => item.product_id == product.product_id
                          ).length > 0
                        ) {
                          let newCart = prop.cartList;
                          newCart[
                            prop.cartList.findIndex(
                              (item) => item.product_id == product.product_id
                            )
                          ].quantity += quantity;
                          prop.setCartList(newCart);
                        } else prop.setCartList([...prop.cartList, cart]);
                      }
                    }}
                  >
                    หยิบใส่ตะกร้า
                  </Button>
                </Stack>

                <Stack>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PointOfSaleIcon />}
                    disabled={product.stock == 0}
                    onClick={() => {
                      if (prop.jwt_token == "") {
                        Swal.fire({
                          icon: "info",
                          title: "กรุณาเข้าสู่ระบบ",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        return;
                      }
                      if (
                        prop.cartList.length > 0 &&
                        product.farmer_id !==
                          prop.cartList.find(
                            (item) => item.farmer_id == product.farmer_id
                          )?.farmer_id
                      ) {
                        Swal.fire({
                          icon: "question",
                          title: "คุณต้องการเปลี่ยนร้านค้าหรือไม่",
                          text: "หากต้องการเปลี่ยนร้านค้า รายการสินค้าในตะกร้าจะถูกลบทิ้ง",
                          showDenyButton: true,
                          confirmButtonText: "ใช่",
                          denyButtonText: "ไม่",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            prop.setCartList([]);
                            let cart: Cart = {
                              product_id: product.product_id,
                              quantity: quantity,
                              product_name: product.product_name,
                              price: product.price,
                              stock: product.stock,
                              farmer_id: product.farmer_id,
                              weight: product.weight,
                              shippingcost: product.shippingcost,
                            };
                            prop.setCartList([cart]);
                            setGoCart(true);
                          }
                        });
                      } else {
                        let cart: Cart = {
                          product_id: product.product_id,
                          quantity: quantity,
                          product_name: product.product_name,
                          price: product.price,
                          stock: product.stock,
                          farmer_id: product.farmer_id,
                          weight: product.weight,
                          shippingcost: product.shippingcost,
                        };
                        prop.setCartList([cart]);
                        setGoCart(true);
                      }
                    }}
                  >
                    ซื้อสินค้า
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </>
      )}

      {showFullImage && (
        <Modal
          open={showFullImage != ""}
          onClose={() => setShowFullImage("")}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <img
              style={{
                width: "100%",
                height: "70%",
              }}
              src={`${config.getApiEndpoint(
                `getimage/${showFullImage.split("/").pop()}`,
                "get"
              )}`}
            />
          </Box>
        </Modal>
      )}
      <Box
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
          borderRadius: 2,
          padding: 2,
          margin: "20px 0",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Stack>
            <Typography variant="h5">{shopname}</Typography>
          </Stack>
          <Stack>
            {(prop.jwt_token == "" ||
              (jwtDecode(prop.jwt_token) as { role: string }).role ==
                "members") && (
              <Chip
                label="ติดตาม"
                icon={
                  prop.followList.filter((item) => {
                    return item.id === product.farmer_id;
                  }).length > 0 ? (
                    <FavoriteIcon
                      sx={{
                        fill: "white",
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                sx={
                  prop.followList.filter((item) => {
                    return item.id === product.farmer_id;
                  }).length > 0
                    ? {
                        backgroundColor: "#ee4267",
                        color: "white",
                      }
                    : {}
                }
                onClick={() => {
                  const apiFollow = config.getApiEndpoint(
                    `followfarmer`,
                    "post"
                  );
                  const apiUnFollow = config.getApiEndpoint(
                    `followfarmer`,
                    "delete"
                  );
                  if (
                    prop.followList.filter((item) => {
                      return item.id === product.farmer_id;
                    }).length > 0 &&
                    prop.jwt_token !== ""
                  ) {
                    axios
                      .delete(apiUnFollow, {
                        data: {
                          farmer_id: product.farmer_id,
                        },
                        headers: {
                          Authorization: `Bearer ${prop.jwt_token}`,
                        },
                      })
                      .then(() => {
                        prop.setFollowList(
                          prop.followList.filter((item) => {
                            return item.id !== product.farmer_id;
                          })
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    axios
                      .post(
                        apiFollow,
                        {
                          farmer_id: product.farmer_id,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${prop.jwt_token}`,
                          },
                        }
                      )
                      .then(() => {
                        prop.setFollowList([
                          ...prop.followList,
                          {
                            id: product.farmer_id,
                            farmerstorename: shopname ? shopname : "",
                          },
                        ]);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }}
              />
            )}
          </Stack>
        </Stack>
        <Typography>
          โดย {product.firstname + " " + product.lastname}
        </Typography>

        {product.facebooklink || product.lineid ? (
          <Typography variant="h6">ช่องทางการติดต่อ</Typography>
        ) : null}

        {product.facebooklink && (
          <Stack
            direction="row"
            spacing={2}
            onClick={() => {
              window.open(product.facebooklink, "_blank");
            }}
            sx={{
              cursor: "pointer",
            }}
          >
            <Stack>
              <FacebookIcon
                style={{ borderRadius: "100%", width: 30, height: "auto" }}
              />
            </Stack>
            <Stack>
              <Typography>{product.facebooklink}</Typography>
            </Stack>
          </Stack>
        )}
        {product.lineid && (
          <>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                cursor: "pointer",
              }}
              onClick={handleCopy(product.lineid)}
            >
              <Stack>
                <LineIcon
                  style={{ borderRadius: "100%", width: 30, height: "auto" }}
                />
              </Stack>
              <Stack>
                <Typography>{product.lineid}</Typography>
              </Stack>
            </Stack>
          </>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: 2,
          }}
        >
          <NavLink to={`/shop/${shopname}`}>
            <Button variant="contained">ดูสินค้าอื่นๆภายในร้าน</Button>
          </NavLink>
        </div>
      </Box>

      {comment.length > 0 && (
        <Box>
          <Typography variant="h5">ความคิดเห็น</Typography>
          {comment.map((item) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 2,
                  marginBottom: 2,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {
                    <div
                      style={{
                        color: "#ffd700",
                      }}
                    >
                      <Typography variant="h6">
                        {item.rating.toFixed(1)}
                      </Typography>
                      {item.rating >= 1 ? (
                        <StarIcon />
                      ) : item.rating >= 0.5 ? (
                        <StarHalfIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                      {item.rating >= 2 ? (
                        <StarIcon />
                      ) : item.rating >= 1.5 ? (
                        <StarHalfIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                      {item.rating >= 3 ? (
                        <StarIcon />
                      ) : item.rating >= 2.5 ? (
                        <StarHalfIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                      {item.rating >= 4 ? (
                        <StarIcon />
                      ) : item.rating >= 3.5 ? (
                        <StarHalfIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                      {item.rating >= 5 ? (
                        <StarIcon />
                      ) : item.rating >= 4.5 ? (
                        <StarHalfIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </div>
                  }
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 2,
                  }}
                >
                  <Typography variant="subtitle1">{item.comment}</Typography>
                  <Typography variant="subtitle1">
                    โดย {item.member_username}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
      {product.lat && product.lng && (
        <MapContainer
          center={[product.lat, product.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "250px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[product.lat, product.lng]} icon={iconMarker}>
            <Popup>{product.address}</Popup>
          </Marker>
        </MapContainer>
      )}
    </Container>
  );
};

export default SigleProduct;
