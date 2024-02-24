import React, { useEffect } from "react";
import TabPanel from "@mui/lab/TabPanel";
import SearchBar from "../../components/searchbar";
import { styled, alpha } from "@mui/material/styles";
import { Typography, TextField, MenuItem, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  InputBase,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import { useSearchParams, Link } from "react-router-dom";
import * as config from "../../config/config";
import axios from "axios";
import { NavLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RGBColor } from "react-color";
import Pagination from "@mui/material/Pagination";

const SearchSection = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  @media (min-width: 600px) {
    padding: 0 20px;
  }
`;

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

const Cateagory = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 15%;
  background-color: #f5f5f5;
  align-items: center;
  padding: 0 10px;
  @media (min-width: 600px) {
    padding: 20px;
  }
`;

interface CateagoryInterface {
  category_id: string;
  category_name: string;
  bgcolor?: string;
}

interface ProductInterface {
  product_id: string;
  product_name: string;
  price: number;
  product_image: string;
  product_description: string;
  category_id: string;
  last_modified: Date;
  view_count: number;
  selectedType: string;
}

const ListProduct = () => {
  const apiCategories = config.getApiEndpoint("categories", "GET");
  const apiProducts = config.getApiEndpoint("getproducts", "GET");
  const [search, setSearch] = React.useState("");
  const [searchContent, setSearchContent] = React.useState("");
  const [sortBy, setSortBy] = React.useState<
    "last_modified" | "price" | "view_count"
  >("last_modified");
  const [order, setOrder] = React.useState<"asc" | "desc">("desc");
  const [allCategory, setAllCategory] = React.useState<CateagoryInterface[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    React.useState<CateagoryInterface>({
      category_id: "",
      category_name: "ทั้งหมด",
    });
  const [page, setPage] = React.useState("0");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showProduct, setShowProduct] = React.useState<ProductInterface[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    axios.get(apiCategories).then((res) => {
      setAllCategory([
        {
          category_id: "",
          category_name: "ทั้งหมด",
          bgcolor: "",
        },
        ...res.data,
      ]);
    });

    let paramsCategory = searchParams.get("category");
    let paramsSort = searchParams.get("sort");
    let paramsOrder = searchParams.get("order");
    let paramsPage = searchParams.get("page");

    setSearchParams({
      ["category"]: paramsCategory
        ? paramsCategory
        : selectedCategory.category_id,
      ["sort"]: paramsSort ? paramsSort : sortBy,
      ["order"]: paramsOrder ? paramsOrder : order,
      ["page"]: paramsPage ? paramsPage : page,
    });

    if (paramsCategory) {
      setSelectedCategory({
        category_id: searchParams.get("category") as string,
        category_name: "all",
      });
    }

    if (paramsSort) {
      setSortBy(
        searchParams.get("sort") as "last_modified" | "price" | "view_count"
      );
    }

    if (paramsOrder) {
      setOrder(searchParams.get("order") as "asc" | "desc");
    }

    if (paramsPage) {
      setPage(searchParams.get("page") as string);
    }
  }, []);

  useEffect(() => {
    // check if category is changed
    console.log(
      searchParams.get("category"),
      selectedCategory.category_id,
      page
    );

    //  set page to 0 when category is changed

    if (searchParams.get("category") !== selectedCategory.category_id) {
      setPage("0");
    }

    setSearchParams({
      ["search"]: searchContent,
      ["category"]: selectedCategory.category_id,
      ["sort"]: sortBy,
      ["order"]: order,
      ["page"]: page,
    });

    axios
      .get(apiProducts, {
        params: {
          ["search"]: searchContent,
          ["category"]: selectedCategory.category_id,
          ["page"]: page,
          ["sort"]: sortBy,
          ["order"]: order,
        },
      })
      .then((res) => {
        console.log(res.data);
        setShowProduct(res.data.products);
        setHasMore(res.data.hasMore);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategory, page, sortBy, order, searchContent]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
          sx={{
            marginTop: "20px",
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {allCategory.map((item, index) => {
            let bgcolor = item.bgcolor
              ? JSON.parse(item.bgcolor)
              : ({ r: 68, g: 93, b: 72, a: 1 } as {
                  r: number;
                  g: number;
                  b: number;
                  a: number;
                });
            return (
              <Tab
                sx={{
                  color: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                }}
                key={index}
                label={item.category_name}
                icon={<LocationOnIcon />}
                onClick={() => setSelectedCategory(item)}
              />
            );
          })}
        </Tabs>
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingLeft: "10px",
            marginBottom: "20px",
          }}
        >
          <InputBase
            sx={{
              width: "100%",
            }}
            placeholder="ค้นหาสินค้า"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={() => {
              setSearchContent(search);
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
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

        <div style={{ display: "flex", flexDirection: "row" }}>
          <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={1}>
              {showProduct.map((product, index) => {
                let date = new Date(product.last_modified).toLocaleDateString();
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
                let nameCategory = allCategory.find(
                  (item) => item.category_id === product.category_id
                )?.category_name
                  ? allCategory.find(
                      (item) => item.category_id === product.category_id
                    )?.category_name
                  : "OTHER";
                return (
                  <Grid item key={index} lg={3} xs={6}>
                    <NavLink
                      to={`/shop/${product.product_id}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "10px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
                        }}
                      >
                        <CardMedia
                          component="div"
                          sx={{
                            // 16:9
                            pt: "56.25%",
                          }}
                          image={`${config.getApiEndpoint(
                            `getimage/${product.product_image
                              .split("/")
                              .pop()}`,
                            "get"
                          )}`}
                        />
                        <CardContent sx={{ flexGrow: 1, padding: "20px" }}>
                          <Typography gutterBottom variant="h5">
                            {product.product_name}
                          </Typography>
                          <Chip label={product.selectedType} />
                          <Chip
                            label={nameCategory}
                            sx={{
                              backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                              color: isDark(bgcolor) ? "white" : "black",
                            }}
                          />
                          <Typography>{product.product_description}</Typography>
                        </CardContent>
                        <CardActions>
                          <Typography
                            sx={{
                              color: "green",
                              fontWeight: "bold",
                              fontSize: "20px",
                            }}
                          >
                            {product.price} บาท
                          </Typography>
                        </CardActions>
                      </Card>
                    </NavLink>
                  </Grid>
                );
              })}
            </Grid>
            <Pagination
              count={parseInt(page) + 1}
              page={parseInt(page) + 1}
              onChange={(e, value) => {
                setPage((value - 1).toString());
              }}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              {parseInt(page) > 0 && (
                <Button
                  onClick={() => {
                    setPage((prev) => (parseInt(prev) - 1).toString());
                  }}
                >
                  ก่อนหน้า
                </Button>
              )}
              {hasMore && (
                <Button
                  onClick={() => {
                    setPage((prev) => (parseInt(prev) + 1).toString());
                  }}
                >
                  ถัดไป
                </Button>
              )}
            </div>
          </Container>
        </div>
      </Container>
    </div>
  );
};

export default ListProduct;
