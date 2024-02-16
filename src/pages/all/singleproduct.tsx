import React, { useEffect } from "react";
import { Fade } from "react-slideshow-image";
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
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import axios from "axios";
import * as config from "../../config/config";

interface ProductInterface {
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_description: string;
  product_category: string;
  product_date: Date;
  product_viewed: number;
}

interface FullProductInterface {
  product_id: string;
  product_name: string;
  product_description: string;
  product_category: string;
  product_stock: number;
  product_price: number;
  unit: string;
  product_image: string;
  product_video: string | null;
  additional_image: string[];
  certificate: string[];
  product_viewed: number;
  campaign_id: string;
  last_modified: Date;
}
const mockProduct = [
  {
    product_id: "1",
    product_name: "product1",
    product_price: 100,
    product_image: "https://source.unsplash.com/random?wallpapers",
    product_description: "description1",
    product_category: "category1",
    product_date: new Date(),
    product_viewed: 100,
  },
  {
    product_id: "2",
    product_name: "product2",
    product_price: 200,
    product_image: "https://source.unsplash.com/random?wallpapers",
    product_description: "description2",
    product_category: "category2",
    product_date: new Date(),
    product_viewed: 200,
  },
  {
    product_id: "3",
    product_name: "product3",
    product_price: 300,
    product_image: "https://source.unsplash.com/random?wallpapers",
    product_description: "description3",
    product_category: "category3",
    product_date: new Date(),
    product_viewed: 300,
  },
  {
    product_id: "4",
    product_name: "product4",
    product_price: 400,
    product_image: "https://source.unsplash.com/random?wallpapers",
    product_description: "description4",
    product_category: "category4",
    product_date: new Date(),
    product_viewed: 400,
  },
  {
    product_id: "5",
    product_name: "product5",
    product_price: 500,
    product_image: "https://source.unsplash.com/random?wallpapers",
    product_description: "description5",
    product_category: "category5",
    product_date: new Date(),
    product_viewed: 500,
  },
] as ProductInterface[];

const SigleProduct = () => {
  const [amount, setAmount] = React.useState(1);
  const [showProduct, setShowProduct] = React.useState<ProductInterface[]>([]);
  const [product, setProduct] = React.useState<FullProductInterface>({
    product_id: "",
    product_name: "",
    product_description: "",
    product_category: "",
    product_stock: 0,
    product_price: 0,
    unit: "",
    product_image: "",
    product_video: "",
    additional_image: [],
    certificate: [],
    product_viewed: 0,
    campaign_id: "",
    last_modified: new Date(),
  });
  const { productid } = useParams<{ productid: string }>();

  const images = [
    "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  ];

  useEffect(() => {
    setShowProduct(mockProduct);
    const apiSingleProduct = config.getApiEndpoint(
      `getproduct/${productid}`,
      "get"
    );
    axios.get(apiSingleProduct).then((response) => {
      console.log(response.data);
      setProduct(response.data);
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

  return (
    <Container component="main" maxWidth="lg">
      <Fade autoplay={false}>
        <div className="each-slide-effect">
          <div
            style={{
              backgroundImage: `url(${config.getApiEndpoint(
                `getimage/${product.product_image.split("/").pop()}`,
                "get"
              )})`,
            }}
          >
            <span>Slide 1</span>
          </div>
        </div>
        <div className="each-slide-effect">
          <div style={{ backgroundImage: `url(${images[1]})` }}>
            <span>Slide 2</span>
          </div>
        </div>
        <div className="each-slide-effect">
          <div style={{ backgroundImage: `url(${images[2]})` }}>
            <span>Slide 3</span>
          </div>
        </div>
      </Fade>
      <Typography variant="h4">{product.product_name}</Typography>
      <Typography variant="h6">Price: {product.product_price}</Typography>
      <Typography variant="h6">
        Description: {product.product_description}
      </Typography>
      <Typography variant="body1">View: {product.product_viewed}</Typography>
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
    </Container>
  );
};

export default SigleProduct;
