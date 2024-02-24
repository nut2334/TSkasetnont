import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import * as config from "../../config/config";

interface ProductInterface {
  product_id: string;
  product_name: string;
  price: number;
  product_image: string;
  product_description: string;
  product_category: string;
  last_modified: Date;
  product_viewed: number;
}
const Myproducts = (prop: { jwt_token: string, username: string }) => {
  const [allProduct, setAllProduct] = useState<ProductInterface[]>([])
  const [navigatePath, setNavigatePath] = useState("");
  const fetchProduct = () => {
    const apiMyproducts = config.getApiEndpoint(`myproducts/${prop.username}`, "GET");
    axios
      .get(apiMyproducts)
      .then((response: any) => {
        console.log(response.data);

        setAllProduct(response.data)
      });
  }
  useEffect(() => {
    fetchProduct()
  }, []);
  if (navigatePath) {
    return <Navigate to={`/editproduct/${navigatePath}`} />
  }
  return (
    <Container component="main" maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SearchIcon />}
            style={{ marginRight: "8px" }}
          >
            ค้นหา
          </Button>
          <NavLink to="/addproduct">
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              เพิ่มสินค้า
            </Button>
          </NavLink>
        </Grid>
      </Grid>
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {allProduct && allProduct.map((product, index) => (
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
                  image={`${config.getApiEndpoint(
                    `getimage/${product.product_image.split("/").pop()}`,
                    "get"
                  )}`}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.product_name}
                  </Typography>
                  <Typography>
                    {product.product_description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <NavLink to={"/shop/" + product.product_id}>
                    <Button size="small">View</Button>
                  </NavLink>
                  <Button size="small" onClick={() => {
                    setNavigatePath(product.product_id)
                  }}>Edit</Button>
                  <Button size="small" onClick={() => {
                    const apiDeleteProduct = config.getApiEndpoint(`deleteproduct/${product.product_id}`, "POST");
                    axios.delete(apiDeleteProduct,
                      {
                        headers: {
                          Authorization: `Bearer ${prop.jwt_token}`,
                        },
                      }
                    ).then(() => {
                      fetchProduct()
                    });
                  }}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default Myproducts;
