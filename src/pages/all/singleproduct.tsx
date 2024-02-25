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
  TextField,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
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
import { QuantityInput } from "../../components/addamount";

import {
  FacebookShareButton,
  LineShareButton,
  FacebookIcon,
  LineIcon,
} from "react-share";
import { Cart } from "../../App";

interface ProductInterface {
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_description: string;
  product_category: string;
  product_date: Date;
  view_count: number;
  selectedType: string;
}

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
  certificate: string[];
  view_count: number;
  campaign_id: string;
  last_modified: Date;
  selectedType: string;
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
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
  cartList: Cart[];
}) => {
  const carousel = useRef<AliceCarousel>(null);
  const [amount, setAmount] = useState(1);
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
    certificate: [],
    view_count: 0,
    campaign_id: "",
    last_modified: new Date(),
    selectedType: "",
  });
  const { productid } = useParams<{ productid: string }>();
  const [showFullImage, setShowFullImage] = useState("");

  useEffect(() => {
    const apiSingleProduct = config.getApiEndpoint(
      `getproduct/${productid}`,
      "get"
    );
    axios.get(apiSingleProduct).then((response) => {
      console.log(response.data);
      setProduct(response.data);
    });

    const apiUpdateView = config.getApiEndpoint(
      `updateview/${productid}`,
      "get"
    );
    axios
      .get(apiUpdateView)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const GenerateSlide = () => {
    let slides = [];
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
    if (product.additional_image) {
      console.log(product.additional_image);
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
    if (product.additional_image) {
      console.log(product.additional_image);
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

      <Typography variant="h4">{product.product_name}</Typography>

      <Typography
        variant="h6"
        sx={{
          color: "green",
        }}
      >
        {product.price} บาท/{product.unit}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          cursor: "pointer",
        }}
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
      <Typography variant="h6">{product.product_description}</Typography>
      {product.selectedType !== "ประชาสัมพันธ์" && (
        <>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              cursor: "pointer",
              paddingTop: "5px",
            }}
            marginLeft={2}
          >
            <Stack>
              <QuantityInput
                stock={product.stock}
                amount={amount}
                setAmount={setAmount}
              />
            </Stack>
            {product.selectedType == "สินค้าจัดส่งพัสดุ" && (
              <Stack>
                <Typography>
                  มีสินค้าทั้งหมด {product.stock} {product.unit}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Box>
            <Typography variant="h6">ค่าจัดส่ง</Typography>
            {/* ทำต่อ */}
            <Typography>{}</Typography>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: 2, marginBottom: 5 }}
            justifyContent="end"
          >
            {product.selectedType == "จองสินค้าผ่านเว็บไซต์" && (
              <Stack>
                <NavLink to={`/reservation/${product.product_id}`}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PointOfSaleIcon />}
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
                    disabled={product.stock == 0}
                    onClick={() => {
                      let cart: Cart = {
                        product_id: product.product_id,
                        amount: amount,
                        product_name: product.product_name,
                        price: product.price,
                        stock: product.stock,
                      };
                      prop.cartList.find(
                        (item) => item.product_id == product.product_id
                      );
                      if (
                        typeof prop.cartList.find(
                          (item) => item.product_id == product.product_id
                        ) !== "undefined"
                      ) {
                        let index = prop.cartList.findIndex(
                          (item) => item.product_id == product.product_id
                        );
                        let newCart = [...prop.cartList];
                        newCart[index].amount += amount;
                        prop.setCartList(newCart);
                      } else {
                        prop.setCartList([...prop.cartList, cart]);
                      }
                    }}
                  >
                    หยิบใส่ตะกร้า
                  </Button>
                </Stack>

                <Stack>
                  <NavLink to="/payment">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PointOfSaleIcon />}
                      disabled={product.stock == 0}
                    >
                      ซื้อสินค้า
                    </Button>
                  </NavLink>
                </Stack>
              </>
            )}
          </Stack>
        </>
      )}

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
    </Container>
  );
};

export default SigleProduct;
