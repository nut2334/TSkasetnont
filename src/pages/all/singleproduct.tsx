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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  Chip,
  Grid,
  IconButton,
  Snackbar,
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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  FacebookShareButton,
  LineShareButton,
  FacebookIcon,
  LineIcon,
} from "react-share";
import { Cart } from "../../App";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Swal from "sweetalert2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, point } from "leaflet";
import { useCopyToClipboard } from "usehooks-ts";
import { Rating } from "@mui/material";
import Path from "../../components/path";
import { Facebook as Fbicon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import Yearlybar from "../../components/yearlybar";
import { status_reserve } from "../../config/dataDropdown";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
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
  selectedStatus?: string;
  shippingcost: string;
  date_reserve_start?: string;
  date_reserve_end?: string;
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
  lastLogin: string;
  forecastDate: string;
  phone: string;
  username: string;
  period: string;
  editor_info?: {
    editor_username: string;
    lastmodified: string;
  };
}

interface Reservetoday {
  category_name: string;
  contact: string;
  member_id: string;
  product_id: string;
  product_name: string;
  total_quantity: number;
  id: string;
  username: string;
  status: string;
  period: string;
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
    lastLogin: "",
    forecastDate: "",
    phone: "",
    username: "",
    period: "",
    
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
  const [reserveTable, setReserveTable] = React.useState<Reservetoday[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const apiSingleProduct = config.getApiEndpoint(
      `getproduct/${encodeURI(shopname ? shopname : "")}/${productid}`,
      "get"
    );
    axios.get(apiSingleProduct).then((response) => {
      setProduct({
        ...response.data,
        certificate: response.data.certificate
          ? JSON.parse(response.data.certificate)
          : [],
      });
      if (response.data.certificate) {
        let allStandard = JSON.parse(response.data.certificate) as {
          standard_id: string;
          standard_name: string;
          status: string;
        }[];

        let standardComplete = allStandard
          .filter(
            (item: {
              standard_id: string;
              standard_name: string;
              status: string;
            }) => item.status === "complete"
          )
          .map((item) => item.standard_name);

        setAllStandardShow(standardComplete);
      }
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
    console.log(product);
  }, [productid, shopname]);

  useEffect(() => {
    const apiComments = config.getApiEndpoint(`getcomment/${productid}`, "get");
    axios.get(apiComments).then((response) => {
      setComment(response.data.reviews);
    });
    const apiAllStandard = config.getApiEndpoint(`standardproducts`, "get");
    axios
      .get(apiAllStandard)
      .then((response) => {
        console.log(response.data);
        setAllStandard(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (product?.product_id === "") return;
    axios
      .get(
        config.getApiEndpoint(`reservetable/${product?.product_id}`, "GET"),
        {
          headers: {
            Authorization: `Bearer ${prop.jwt_token}`,
          },
        }
      )
      .then((res) => {
        setReserveTable(
          res.data.map((order: Reservetoday, index: number) => {
            return {
              ...order,
              id: index,
              status: status_reserve.find(
                (status) => status.statusID === order.status
              )?.statusName,
            };
          })
        );
      });
  }, [product]);
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
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

  let LastLogin = () => {
    let lastLogin = new Date(product.lastLogin);
    let daySinceLastLogin = Math.floor(
      (new Date().getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daySinceLastLogin > 0
      ? `(เข้าสู่ระบบล่าสุดเมื่อ ${daySinceLastLogin} วันที่ผ่านมา)`
      : "(เข้าสู่ระบบล่าสุดวันนี้)";
  };

  let CheckReserveValid = () => {
    if (product.selectedStatus == "ปิดรับจอง") {
      return false;
    }
    if (product.selectedStatus == "เปิดรับจองตลอด") {
      return true;
    }
    if (
      product.date_reserve_end == null ||
      product.date_reserve_start == null
    ) {
      return false;
    }
    let today = new Date();
    let start = new Date(product.date_reserve_start);
    let end = new Date(product.date_reserve_end);
    console.log(today, start, end);
    if (today >= start && today <= end) {
      return true;
    }
    return false;
  };

  const handleActivate = () => {
    axios
      .get(config.getApiEndpoint(`repeatactivate`, "get"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "ส่งอีเมลยืนยันตัวตนสำเร็จ",
          text: "กรุณายืนยันตัวตนจากอีเมลของคุณ เมื่อยืนยันตัวตนแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <Container component="main" maxWidth="lg">
      <Path />
     
      <Box sx={{ position: "relative" }}>
        <Box display={{ xs: "none", lg: "flex" }}>
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
      <Stack direction="row" spacing={2}>
        <Stack>
          <Typography variant="h4">
            {product.product_name}{" "}
            {product.stock === 0 &&
              product.selectedType == "สินค้าจัดส่งพัสดุ" && (
                <div
                  style={{
                    color: "red",
                  }}
                >
                  สินค้าหมด
                </div>
              )}
          </Typography>
        </Stack>
        {prop.jwt_token &&
          (jwtDecode(prop.jwt_token) as { ID: string }).ID ==
            product.farmer_id && (
            <Stack>
              <NavLink
                to={`/editproduct/${shopname}/${product.username}/${product.product_id}`}
              >
                <Chip icon={<EditIcon />} label="แก้ไขสินค้า" />
              </NavLink>
            </Stack>
          )}
      </Stack>
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
        justifyContent={product.editor_info && product.editor_info.editor_username !== null ? "space-between": "flex-end"}
      >
        {product.editor_info && product.editor_info.editor_username !== null && (
        <Stack>
            <Typography color="textSecondary">
              แก้ไขล่าสุดโดย {product.editor_info?.editor_username} วันที่{" "}
              {product.editor_info?.lastmodified &&
                new Date(product.editor_info?.lastmodified).toLocaleDateString(
                  "th-TH",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    minute: "numeric",
                    hour: "numeric",
                  }
                )}
            </Typography>
            </Stack>
          )}
            <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              "& > *": {
                marginLeft: 1, // กำหนดระยะห่างด้านซ้ายของทุก child ใน Stack เป็น 1 unit
              },
            }}
           
            >
        <Stack>
          <RemoveRedEyeIcon />
        </Stack>

        <Stack>
          <Typography variant="body1">{product.view_count}</Typography>
        </Stack>
        <Stack>
          <Typography variant="body1"> | แชร์ : </Typography>
        </Stack>
        <Stack>
          <FacebookShareButton
            url={`https://thebestkasetnont.doae.go.th/#/listproduct/${shopname}/${productid}`}
          >
            <FacebookIcon
              style={{ borderRadius: "100%", width: 30, height: "auto" }}
            />
          </FacebookShareButton>
        </Stack>
        <Stack>
          <LineShareButton
            url={`https://thebestkasetnont.doae.go.th/#/listproduct/${shopname}/${productid}`}
          >
            <LineIcon
              style={{ borderRadius: "100%", width: 30, height: "auto" }}
            />
          </LineShareButton>
        </Stack>
        <Stack
        sx={{ cursor: "pointer" }}>
          <RWebShare
            
            data={{
              text: product.product_description,
              url: `https://thebestkasetnont.doae.go.th/#/listproduct/${shopname}/${productid}`,
              title: "ของเด็ดเกษตรนนท์",
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <ShareIcon />
          </RWebShare>
        </Stack></Stack>
      </Stack>
      <Divider
        sx={{
          marginBottom: 2,
          marginTop: 1,
        }}
      />
       
      <Typography variant="h6">รายละเอียดสินค้า</Typography>
      {product.selectedType == "จองสินค้าผ่านเว็บไซต์" && (
        <>
          <Typography>ประเภทการจอง: {product.selectedStatus}</Typography>
          {product.date_reserve_start && product.date_reserve_end && (
            <Typography>
              <span>
                ระยะเวลาจองสินค้า :{" "}
                {new Date(product.date_reserve_start).toLocaleDateString()} ถึง{" "}
                {new Date(product.date_reserve_end).toLocaleDateString()}
              </span>
            </Typography>
          )}
          {CheckReserveValid() ? (
            <Typography
              style={{
                color: "green",
              }}
            >
              {" "}
              (สามารถจองสินค้าได้)
            </Typography>
          ) : (
            <Typography
              style={{
                color: "red",
              }}
            >
              {" "}
              (ไม่สามารถจองสินค้าได้)
            </Typography>
          )}
          <Typography>
            คาดว่าจะได้รับสินค้าในเดือน{" "}
            {new Date(product.forecastDate).toLocaleDateString("th-TH", {
              month: "long",
            })}
          </Typography>
        </>
      )}
      <Typography
        sx={{
          marginTop: 1,
        }}
      >
        {product.product_description}
      </Typography>
      <Divider
        sx={{
          marginBottom: 2,
          marginTop: 1,
        }}
      />
      {product.selectedType == "จองสินค้าผ่านเว็บไซต์" &&
        prop.jwt_token &&
        (jwtDecode(prop.jwt_token) as { ID: string }).ID == product.farmer_id &&
        product.product_id && (
          <>
            {reserveTable.length > 0 && (
              <>
                {product?.period && (
                  <Grid xs={12} sx={{ marginTop: 2 }}>
                    <Typography variant="h6">
                      การจองสินค้า{"(" + product.product_name + ") "}ตัดรอบทุก{" "}
                      {new Date(product.period).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                      })}{" "}
                      ทั้งหมด {reserveTable ? reserveTable.length : "0"} รายการ
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <DataGrid
                    rows={reserveTable ? reserveTable : []}
                    columns={[
                      { field: "username", headerName: "ชื่อผู้ใช้", flex: 1 },
                      { field: "contact", headerName: "ติดต่อ", flex: 1 },
                      {
                        field: "product_name",
                        headerName: "ชื่อสินค้า",
                        flex: 1,
                      },
                      { field: "total_quantity", headerName: "จำนวน", flex: 1 },
                      { field: "status", headerName: "สถานะ", flex: 1 },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    ยอดรวมสินค้าทั้งหมด{" "}
                    {reserveTable.reduce(
                      (acc, order) => acc + order.total_quantity,
                      0
                    )}{" "}
                    ชิ้น
                  </Typography>
                  <Typography>
                    ยอดรวมสินค้าที่อนุมัติแล้ว{" "}
                    {reserveTable.reduce((acc, order) => {
                      if (order.status === "สำเร็จ") {
                        return acc + order.total_quantity;
                      }
                      return acc;
                    }, 0)}{" "}
                    ชิ้น
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </>
            )}
            <Yearlybar
              jwt_token={prop.jwt_token}
              product_name={product.product_name}
              product_id={product.product_id}
            />
          </>
        )}

      {allStandardShow.length > 0 && (
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
                    <TableCell>มาตรฐานที่ได้รับ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allStandardShow.map((item) => {
                    return (
                      <TableRow key={item}>
                        <TableCell component="th" scope="row">
                          {item}{" "}
                          {item === "นนทบุรีการันตี" ? (
                            <IconButton>
                              <img
                                style={{
                                  width: "20px",
                                  height: "100%",
                                }}
                                src={require("../../assets/GUARANTEE.png")}
                              />
                            </IconButton>
                          ) : (
                            ""
                          )}
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
            {prop.jwt_token &&
              (jwtDecode(prop.jwt_token) as { role: string }).role ==
                "members" && (
                <Stack>
                  {prop.jwt_token &&
                  (jwtDecode(prop.jwt_token) as { activate: boolean })
                    .activate ? (
                    ""
                  ) : (
                    <Button
                      startIcon={<AdminPanelSettingsIcon />}
                      variant="contained"
                      onClick={handleActivate}
                    >
                      ยืนยันตัวตน
                    </Button>
                  )}
                </Stack>
              )}
            {product.selectedType == "จองสินค้าผ่านเว็บไซต์" &&
              (prop.jwt_token == "" ||
                (jwtDecode(prop.jwt_token) as { role: string }).role ==
                  "members") && (
                <Stack>
                  <NavLink to={prop.jwt_token == "" ? "/login" : ""}>
                    <Button
                      disabled={
                        prop.jwt_token == ""
                          ? true
                          : (jwtDecode(prop.jwt_token) as { role: string })
                              .role !== "members" ||
                            !(
                              jwtDecode(prop.jwt_token) as { activate: boolean }
                            ).activate ||
                            !CheckReserveValid()
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
                      {prop.jwt_token !== "" &&
                      (jwtDecode(prop.jwt_token) as { activate: boolean })
                        .activate
                        ? ""
                        : " (ต้องยืนยันตัวตนก่อน)"}
                    </Button>
                  </NavLink>
                </Stack>
              )}
            {product.selectedType == "สินค้าจัดส่งพัสดุ" &&
              (prop.jwt_token == "" ||
                (prop.jwt_token &&
                  (jwtDecode(prop.jwt_token) as { role: string }).role ==
                    "members")) && (
                <>
                  <Stack>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AddShoppingCartIcon />}
                      disabled={
                        prop.jwt_token == ""
                          ? true
                          : (jwtDecode(prop.jwt_token) as { role: string })
                              .role !== "members" ||
                            product.stock === 0 ||
                            !(
                              jwtDecode(prop.jwt_token) as { activate: boolean }
                            ).activate
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
                      {prop.jwt_token !== "" &&
                      (jwtDecode(prop.jwt_token) as { activate: boolean })
                        .activate
                        ? ""
                        : " (ต้องยืนยันตัวตนก่อน)"}
                    </Button>
                  </Stack>

                  <Stack>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PointOfSaleIcon />}
                      disabled={
                        prop.jwt_token == ""
                          ? true
                          : (jwtDecode(prop.jwt_token) as { role: string })
                              .role !== "members" ||
                            product.stock === 0 ||
                            !(
                              jwtDecode(prop.jwt_token) as { activate: boolean }
                            ).activate
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
                      {prop.jwt_token !== "" &&
                      (jwtDecode(prop.jwt_token) as { activate: boolean })
                        .activate
                        ? ""
                        : " (ต้องยืนยันตัวตนก่อน)"}
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
                maxHeight: "600px",
                objectFit: "contain",
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
          padding: 3,
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        <Stack direction="row">
          <Stack
            sx={{
              marginRight: 1,
            }}
          >
            <Typography variant="h5">{shopname}</Typography>
          </Stack>
          {prop.jwt_token &&
            (jwtDecode(prop.jwt_token) as { ID: string }).ID ==
              product.farmer_id && (
              <Stack>
                <NavLink to={`/editprofile`}>
                  <Chip icon={<EditIcon />} label="แก้ไขข้อมูล" />
                </NavLink>
              </Stack>
            )}
          <Stack>
            {prop.jwt_token &&
              (jwtDecode(prop.jwt_token) as { role: string }).role ==
                "members" && (
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
          โดย {product.firstname + " " + product.lastname + " "}
        </Typography>

        <Typography
          color={
            new Date().getTime() - new Date(product.lastLogin).getTime() >
            10 * 1000 * 60 * 60 * 24
              ? "red"
              : "green"
          }
        >
          {LastLogin()}
        </Typography>

        {product.facebooklink || product.lineid ? (
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
            }}
          >
            ช่องทางการติดต่อ
          </Typography>
        ) : null}

        {product.facebooklink && (
          <Tooltip title={product.facebooklink}>
            <Button
              sx={{
                backgroundColor: "#4267B2",
              }}
              startIcon={<Fbicon />}
              variant="contained"
              onClick={() => {
                window.open(product.facebooklink, "_blank");
              }}
            >
              Facebook
            </Button>
          </Tooltip>
        )}
        {product.lineid && (
          <>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                cursor: "pointer",
                marginTop: 2,
              }}
              onClick={() => {
                handleClick();
                handleCopy(product.lineid);
              }}
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
          <NavLink to={`/listproduct/${shopname}`}>
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
                      <Rating
                        name="read-only"
                        value={item.rating}
                        readOnly
                        precision={0.5}
                      />
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
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="คัดลอกไอดีไลน์สำเร็จ"
        action={action}
      />
    </Container>
  );
};

export default SigleProduct;
