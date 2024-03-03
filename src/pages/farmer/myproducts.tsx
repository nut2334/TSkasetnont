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
  TextField,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import * as config from "../../config/config";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { MenuItem } from "@mui/material";
import { web_activity } from "../../config/dataDropdown";
import { RGBColor } from "react-color";

interface ProductInterface {
  product_id: string;
  product_name: string;
  price: number;
  product_image: string;
  product_description: string;
  last_modified: Date;
  product_viewed: number;
  farmerstorename: string;
  selectedType: string;
  category_id: string;
  category_name: string;
}
const Myproducts = (prop: { jwt_token: string; username: string }) => {
  const [allProduct, setAllProduct] = useState<ProductInterface[]>([]);
  const [navigatePath, setNavigatePath] = useState("");
  const [allCategory, setAllCategory] = useState<
    {
      category_id: string;
      category_name: string;
      bgcolor: string;
    }[]
  >([]);
  const fetchProduct = () => {
    const apiMyproducts = config.getApiEndpoint(
      `myproducts/${prop.username}`,
      "GET"
    );
    axios.get(apiMyproducts).then((response: any) => {
      console.log(response.data);
      setAllProduct(response.data);
    });
  };

  useEffect(() => {
    fetchProduct();
    axios.get(config.getApiEndpoint("categories", "GET")).then((response) => {
      setAllCategory(response.data);
    });
  }, []);

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };

  if (navigatePath) {
    return <Navigate to={`/editproduct/${navigatePath}`} />;
  }
  return (
    <Container component="main" maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="รูปแบบการเก็บข้อมูล"
            fullWidth
          >
            {
              web_activity.map((option) => (
                <MenuItem key={option.activityID} value={option.activityID}>
                  {option.activityName}
                </MenuItem>
              ))

            }
          </TextField>
        </Grid>
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
          {allProduct &&
            allProduct.map((product, index) => {
              let bgcolor = allCategory.find(
                (item) => item.category_id === product.category_id
              )?.bgcolor
                ? JSON.parse(
                  allCategory.find(
                    (item) => item.category_id === product.category_id
                  )?.bgcolor as string
                )
                : ({ r: 68, g: 93, b: 72, a: 1 } as {
                  r: number;
                  g: number;
                  b: number;
                  a: number;
                });
              return (
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
                      image={product.product_image ? `${config.getApiEndpoint(
                        `getimage/${product.product_image.split("/").pop()}`,
                        "get"
                      )}` : require("../../assets/noimage.jpg")}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.product_name}
                      </Typography>
                      <Chip
                        label={product.category_name}
                        sx={{
                          backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                          color: isDark(bgcolor) ? "white" : "black",
                        }}
                      />
                      <Chip label={product.selectedType} />
                      <Typography>{product.product_description}</Typography>
                    </CardContent>
                    <CardActions>
                      <NavLink
                        to={`/shop/${product.farmerstorename}/${product.product_id}`}
                      >
                        <Button size="small">
                          <VisibilityIcon
                            sx={{
                              color: "#337357",
                            }}
                          />
                        </Button>
                      </NavLink>
                      <Button
                        size="small"
                        onClick={() => {
                          setNavigatePath(
                            `${product.farmerstorename}/${product.product_id}`
                          );
                        }}
                      >
                        <EditIcon sx={{ color: "#FFD23F" }} />
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          Swal.fire({
                            title: "คุณต้องการลบสินค้านี้ใช่หรือไม่?",
                            text: "คุณจะไม่สามารถกู้คืนสินค้านี้ได้อีก",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "ใช่",
                            cancelButtonText: "ไม่",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              const apiDeleteProduct = config.getApiEndpoint(
                                `deleteproduct/${product.product_id}`,
                                "POST"
                              );
                              axios
                                .delete(apiDeleteProduct, {
                                  headers: {
                                    Authorization: `Bearer ${prop.jwt_token}`,
                                  },
                                })
                                .then(() => {
                                  Swal.fire(
                                    "ลบสินค้าสำเร็จ",
                                    "สินค้าของคุณถูกลบเรียบร้อยแล้ว",
                                    "success"
                                  );
                                  fetchProduct();
                                })
                                .catch((error) => {
                                  Swal.fire(
                                    "ลบสินค้าไม่สำเร็จ",
                                    "กรุณาลองใหม่อีกครั้ง",
                                    "error"
                                  );
                                });
                            }
                          });
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            color: "#EE4266",
                          }}
                        />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </Container>
  );
};

export default Myproducts;
