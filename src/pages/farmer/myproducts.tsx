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
  Stack,
  Divider,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AddIcon from "@mui/icons-material/Add";
import {
  NavLink,
  Navigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import * as config from "../../config/config";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Swal from "sweetalert2";
import { MenuItem } from "@mui/material";
import { web_activity } from "../../config/dataDropdown";
import { RGBColor } from "react-color";
import { jwtDecode } from "jwt-decode";

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
  certification: string[];
  phone: string;
  email: string;
  address: string;
}

interface sortInterface {
  title: string;
  type: "last_modified" | "price" | "view_count";
}

const sortType = [
  {
    title: "สินค้าล่าสุด",
    type: "last_modified",
  },
  {
    title: "ราคา",
    type: "price",
  },
  {
    title: "ยอดเข้าชม",
    type: "view_count",
  },
] as sortInterface[];

const Myproducts = (prop: {
  jwt_token: string;
  username?: string;
  padding?: string;
}) => {
  const [sortBy, setSortBy] = useState("last_modified");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [allProduct, setAllProduct] = useState<ProductInterface[]>([]);
  const [navigatePath, setNavigatePath] = useState("");
  const [allCategory, setAllCategory] = useState<
    {
      category_id: string;
      category_name: string;
      bgcolor: string;
    }[]
  >([]);
  const [dataFarmer, setDataFarmer] = useState<{
    firstname: string;
    lastname: string;
    farmerstorename: string;
    address: string;
    email: string;
    phone: string;
    createAt: Date;
    lastLogin: Date;
  }>({
    firstname: "",
    lastname: "",
    farmerstorename: "",
    address: "",
    email: "",
    phone: "",
    createAt: new Date(),
    lastLogin: new Date(),
  });
  const [searchType, setSearchType] = useState("");
  const [filterSearch, setFilterSearch] = useState<ProductInterface[]>([]);
  const [searchStandard, setSearchStandard] = useState("");
  const [allStandard, setAllStandard] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);

  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    fetchProduct();
    axios.get(config.getApiEndpoint("categories", "GET")).then((response) => {
      setAllCategory(response.data);
    });
    let role = (jwtDecode(prop.jwt_token) as { role: string }).role;
    let apiGet = config.getApiEndpoint(
      `getuseradmin/farmers/${username}`,
      "GET"
    );
    let api = config.getApiEndpoint(`getinfo`, "GET");
    axios
      .get(role == "farmers" ? api : apiGet, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setDataFarmer(response.data);
      });
    axios
      .get(config.getApiEndpoint("standardproducts", "GET"))
      .then((response) => {
        setAllStandard(response.data);
      });
  }, []);

  useEffect(() => {
    console.log(sortBy);
    let filter = allProduct;
    if (sortBy === "last_modified") {
      filter = filter.sort((a, b) => {
        if (order === "asc") {
          return (
            new Date(a.last_modified).getTime() -
            new Date(b.last_modified).getTime()
          );
        } else {
          return (
            new Date(b.last_modified).getTime() -
            new Date(a.last_modified).getTime()
          );
        }
      });
    } else if (sortBy === "price") {
      filter = filter.sort((a, b) => {
        if (order === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    } else if (sortBy === "view_count") {
      filter = filter.sort((a, b) => {
        if (order === "asc") {
          return a.product_viewed - b.product_viewed;
        } else {
          return b.product_viewed - a.product_viewed;
        }
      });
    }
    setFilterSearch(filter);
    console.log(filter);
  }, [sortBy, order]);

  const fetchProduct = () => {
    const apiMyproducts = config.getApiEndpoint(
      `myproducts/${prop.username ? prop.username : username}`,
      "GET"
    );
    axios.get(apiMyproducts).then((response: any) => {
      console.log(response.data.result);
      setAllProduct(response.data.result);
      setFilterSearch(response.data.result);
    });
  };

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };
  const handleSearch = () => {
    let filter = allProduct;
    console.log(searchType);
    if (searchType === "all") {
      filter = filter;
    } else if (searchType !== "") {
      filter = filter.filter((product) => {
        return product.selectedType === searchType;
      });
    }
    console.log(searchStandard);
    if (searchStandard === "all") {
      filter = allProduct;
    } else if (searchStandard !== "") {
      filter = filter.filter((product) => {
        let found = product.certification.find(
          (item) => item === searchStandard
        );
        return found;
      });
    }

    setFilterSearch(filter);
  };

  if (navigatePath) {
    return <Navigate to={`/editproduct/${navigatePath}`} />;
  }
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        padding: username ? "20px" : "",
      }}
    >
      <Grid container spacing={2}>
        {((jwtDecode(prop.jwt_token) as { role: string }).role == "admins" ||
          (jwtDecode(prop.jwt_token) as { role: string }).role == "tambons" ||
          (jwtDecode(prop.jwt_token) as { role: string }).role ==
            "providers") && (
          <>
            <Grid item xs={12}>
              <Typography variant="h4">
                จัดการสินค้าของ {dataFarmer.firstname} {dataFarmer.lastname}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">ข้อมูลพื้นฐาน</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                ชื่อร้านค้า: {dataFarmer.farmerstorename}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                ชื่อ: {dataFarmer.firstname} {dataFarmer.lastname}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                อีเมล: {dataFarmer.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                เบอร์โทร:{dataFarmer.phone}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                ที่อยู่:{dataFarmer.address}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                วันที่ลงทะเบียน:
                {new Date(dataFarmer.createAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                วันที่เข้าใช้งานล่าสุด:
                {new Date(dataFarmer.lastLogin).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                มีสินค้าทั้งหมด {allProduct.length} รายการ
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            // label="รูปแบบการเก็บข้อมูล"
            label="รูปแบบการขาย"
            fullWidth
            onChange={(e) => setSearchType(e.target.value as string)}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {web_activity.map((option) => (
              <MenuItem key={option.activityID} value={option.activityName}>
                {option.activityName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="มาตรฐานสินค้า"
            fullWidth
            onChange={(e) => setSearchStandard(e.target.value as string)}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {allStandard.map((option) => (
              <MenuItem key={option.standard_id} value={option.standard_name}>
                {option.standard_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="info"
            startIcon={<SearchIcon />}
            style={{ marginRight: "8px" }}
            onClick={handleSearch}
          >
            ค้นหา
          </Button>
          <NavLink to={`/addproduct/${username ? username : prop.username}`}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              เพิ่มสินค้า
            </Button>
          </NavLink>
        </Grid>
      </Grid>
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonGroup variant="text" aria-label="Basic button group">
                {sortType.map((item, index) => {
                  return (
                    <Button
                      endIcon={
                        sortBy === item.type ? (
                          order === "asc" ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )
                        ) : (
                          <UnfoldMoreIcon />
                        )
                      }
                      key={index}
                      onClick={() => {
                        let newOrder = ["asc", "desc"].filter(
                          (item) => item !== order
                        )[0] as "asc" | "desc";
                        setSortBy(item.type);
                        setOrder(newOrder);
                      }}
                      sx={{
                        color: sortBy === item.type ? "primary" : "black",
                      }}
                    >
                      {item.title}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </div>
          </Grid>

          {filterSearch.length > 0 ? (
            filterSearch.map((product, index) => {
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
                        pt: "56.25%",
                      }}
                      image={
                        product.product_image
                          ? `${config.getApiEndpoint(
                              `getimage/${product.product_image
                                .split("/")
                                .pop()}`,
                              "get"
                            )}`
                          : require("../../assets/noimage.jpg")
                      }
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
                          marginBottom: "8px",
                        }}
                      />
                      <Chip
                        label={product.selectedType}
                        sx={{
                          marginBottom: "8px",
                        }}
                      />
                      <Typography
                        sx={{
                          marginTop: "10px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 4, // จำนวนบรรทัดที่ต้องการแสดง
                        }}
                      >
                        {product.product_description}
                      </Typography>

                      <Tooltip title="วันที่แก้ไขล่าสุด" placement="bottom-end">
                        <Typography
                          sx={{
                            marginTop: "8px",
                            textAlign: "right",
                            fontSize: "0.8rem",
                            color: "gray",
                            alignItems: "center",
                          }}
                        >
                          <EditCalendarIcon
                            sx={{
                              fontSize: "1rem",
                              color: "gray",
                            }}
                          />
                          {" " +
                            new Date(product.last_modified).toLocaleDateString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                        </Typography>
                      </Tooltip>
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
                      {(jwtDecode(prop.jwt_token) as { role: string }).role !==
                        "providers" && (
                        <>
                          <Button
                            size="small"
                            onClick={() => {
                              setNavigatePath(
                                `${product.farmerstorename}/${
                                  username ? username : prop.username
                                }/${product.product_id}`
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
                                  const apiDeleteProduct =
                                    config.getApiEndpoint(
                                      `deleteproduct/${product.product_id}`,
                                      "POST"
                                    );
                                  let role = (
                                    jwtDecode(prop.jwt_token) as {
                                      role: string;
                                    }
                                  ).role;
                                  let body = {};
                                  if (role !== "farmers") {
                                    body = {
                                      username: username,
                                    };
                                  }
                                  axios
                                    .delete(apiDeleteProduct, {
                                      headers: {
                                        Authorization: `Bearer ${prop.jwt_token}`,
                                      },
                                      data: body,
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
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <>
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Stack>
                  <img
                    src={require("../../assets/sad.png")}
                    alt="sad"
                    width="200"
                    height="200"
                  />
                </Stack>
                <Stack>
                  <Typography
                    variant="h4"
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      color: "gray",
                    }}
                  >
                    ไม่มีสินค้าในระบบ
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}
        </Grid>
      </Container>
    </Container>
  );
};

export default Myproducts;
