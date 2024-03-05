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
  shippingcost: string;
  firstname: string;
  lastname: string;
  farmer_id: string;
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
    certificate: [],
    view_count: 0,
    campaign_id: "",
    last_modified: new Date(),
    selectedType: "",
    shippingcost: "",
    firstname: "",
    lastname: "",
    farmer_id: "",
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

  useEffect(() => {
    const apiSingleProduct = config.getApiEndpoint(
      `getproduct/${shopname}/${productid}`,
      "get"
    );
    axios.get(apiSingleProduct).then((response) => {
      setProduct(response.data);
      console.log(response.data);
    });

    const apiUpdateView = config.getApiEndpoint(
      `updateview/${productid}`,
      "get"
    );
    axios
      .get(apiUpdateView)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const apiComments = config.getApiEndpoint(`getcomment/${productid}`, "get");
    axios.get(apiComments).then((response) => {
      setComment(response.data.reviews);
    });
  }, []);

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
              paddingTop: "5px",
            }}
            marginLeft={2}
          >
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
            {product.selectedType == "สินค้าจัดส่งพัสดุ" && (
              <Stack>
                <Typography>
                  มีสินค้าทั้งหมด {product.stock} {product.unit}
                </Typography>
              </Stack>
            )}
          </Stack>
          {product.selectedType == "สินค้าจัดส่งพัสดุ" && (
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
          )}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              paddingTop: "5px",
            }}
            marginLeft={2}
          >
            <Stack>
              {product.shippingcost &&
                JSON.parse(product.shippingcost).map((item: any) => {
                  return (
                    <Typography>
                      น้ำหนัก {">"} {item.weight} กรัม ค่าส่งราคา {item.price}{" "}
                      บาท
                    </Typography>
                  );
                })}
            </Stack>
          </Stack>
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
                            };
                            prop.setCartList([cart]);
                          }
                        });
                      }

                      let cart: Cart = {
                        product_id: product.product_id,
                        quantity: quantity,
                        product_name: product.product_name,
                        price: product.price,
                        stock: product.stock,
                        farmer_id: product.farmer_id,
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
                        newCart[index].quantity += quantity;
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
                  <NavLink to={prop.jwt_token == "" ? "/login" : "/listcart"}>
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
                        let cart: Cart = {
                          product_id: product.product_id,
                          quantity: quantity,
                          product_name: product.product_name,
                          price: product.price,
                          stock: product.stock,
                          farmer_id: product.farmer_id,
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
                          newCart[index].quantity += quantity;
                          prop.setCartList(newCart);
                        } else {
                          prop.setCartList([...prop.cartList, cart]);
                        }
                      }}
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
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">{shopname}</Typography>

        <Typography>
          โดย {product.firstname + " " + product.lastname}
        </Typography>
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
                  <Typography variant="h6">{item.comment}</Typography>
                  <Typography variant="subtitle1">
                    โดย {item.member_username}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default SigleProduct;
