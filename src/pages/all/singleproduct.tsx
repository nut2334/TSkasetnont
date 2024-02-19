import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import "./shop.css";
import {
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
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
import Modal from '@mui/material/Modal';
import ShareIcon from "@mui/icons-material/Share";
import {
  FacebookShareButton,
  LineShareButton,
  FacebookIcon,
  LineIcon,
} from "react-share";

interface ProductInterface {
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_description: string;
  product_category: string;
  product_date: Date;
  view_count: number;
}

interface FullProductInterface {
  product_id: string;
  product_name: string;
  product_description: string;
  product_category: string;
  product_stock: number;
  price: number;
  unit: string;
  product_image: string;
  product_video: string | null;
  additional_image: string;
  certificate: string[];
  view_count: number;
  campaign_id: string;
  last_modified: Date;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "50%",
  maxHeight: "70%",
  bgcolor: 'background.paper',
  boxShadow: 24,

};
const SigleProduct = () => {
  const carousel = useRef<AliceCarousel>(null);
  const [amount, setAmount] = useState(1);
  const [showProduct, setShowProduct] = useState<ProductInterface[]>([]);
  const [product, setProduct] = useState<FullProductInterface>({
    product_id: "",
    product_name: "",
    product_description: "",
    product_category: "",
    product_stock: 0,
    price: 0,
    unit: "",
    product_image: "",
    product_video: "",
    additional_image: "",
    certificate: [],
    view_count: 0,
    campaign_id: "",
    last_modified: new Date(),
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

  const add = () => {
    setAmount(amount + 1);
  };
  const subtract = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };

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
      slides.push(JSON.parse(product.additional_image.replace("\\", "")).map(
        (image: string, index: number) => (
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
      ));
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

    return [].concat(...slides);;
  }
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ position: 'relative' }}>
        <Box display={{ xs: "none", lg: "flex" }}>
          <ArrowBackIosNewIcon
            sx={{
              position: "absolute",
              top: "30%",
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
              top: "30%",
              backgroundColor: "gray",
              color: "white",
              right: 20,
              padding: 1,
            }}
            onClick={(e) => carousel?.current?.slideNext(e)}
          />
        </Box>
        <Box display={{ xs: "flex" }}>
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
        {product.price} บาท
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
          <ShareIcon />
        </Stack>
      </Stack>

      <Typography variant="h6">{product.product_description}</Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          cursor: "pointer",
          paddingTop: "5px",
        }}
        marginLeft={2}
      >
        <Stack>
          {amount == 1 && <DoNotDisturbOnIcon color="info" />}
          {amount > 1 && (
            <DoNotDisturbOnIcon color="secondary" onClick={subtract} />
          )}
        </Stack>
        <Stack>
          <Typography>{amount}</Typography>
        </Stack>
        <Stack>
          <AddCircleIcon color="secondary" onClick={add} />
        </Stack>
      </Stack>
      <Button variant="contained" color="primary">
        Add to Cart
      </Button>
      {showProduct.map((product, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="div"
              sx={{
                // 16:9
                pt: "56.25%",
              }}
              image={product.product_image}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {product.product_name}
              </Typography>
              <Typography>{product.product_description}</Typography>
            </CardContent>
            <CardActions>
              <Typography>ราคา : {product.product_price}</Typography>

              <Button size="small">View</Button>
              <Button size="small">Edit</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
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
