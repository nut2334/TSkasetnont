import React, { useEffect } from "react";
import SearchBar from "../../components/searchbar";
import { styled, alpha } from "@mui/material/styles";
import { Typography, TextField, MenuItem } from "@mui/material";
import {
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import * as config from "../../config/config";
import axios from "axios";

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
  type: "date" | "price" | "viewed";
}

const sortType = [
  {
    title: "สินค้าล่าสุด",
    type: "date",
  },
  {
    title: "ราคา",
    type: "price",
  },
  {
    title: "ยอดเข้าชม",
    type: "viewed",
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
}

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

const ListProduct = () => {
  const apiCategories = config.getApiEndpoint("categories", "GET");
  const apiProducts = config.getApiEndpoint("products", "GET");

  const [searchContent, setSearchContent] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "price" | "viewed">(
    "date"
  );
  const [order, setOrder] = React.useState<"asc" | "desc">("desc");
  const [allCategory, setAllCategory] = React.useState<CateagoryInterface[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    React.useState<CateagoryInterface>({
      category_id: "",
      category_name: "all",
    });
  const [page, setPage] = React.useState("0");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showProduct, setShowProduct] = React.useState<ProductInterface[]>([]);
  const [hasMore, setHasMore] = React.useState(true);

  useEffect(() => {
    axios.get(apiCategories).then((res) => {
      console.log(res.data);
      setAllCategory(res.data);
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
      setSortBy(searchParams.get("sort") as "date" | "price" | "viewed");
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
      ["category"]: selectedCategory.category_id,
      ["sort"]: sortBy,
      ["order"]: order,
      ["page"]: page,
    });

    axios
      .get(apiProducts, {
        params: {
          ["category"]: selectedCategory.category_id,
          ["page"]: page,
        },
      })
      .then((res) => {
        setShowProduct(res.data.products);
        setHasMore(res.data.hasMore);
      })
      .catch((err) => {
        console.log(err);

        setShowProduct(mockProduct);
      });
  }, [selectedCategory, page]);

  useEffect(() => {
    setSearchParams({
      ["category"]: selectedCategory.category_id,
      ["sort"]: sortBy,
      ["order"]: order,
      ["page"]: page,
    });
  }, [searchContent, sortBy, order]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SearchSection>
        <div style={{ width: "50%", margin: "20px auto" }}>
          <SearchBar
            placeholder="ค้นหาสินค้า"
            setSearchContent={setSearchContent}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {sortType.map((item, index) => {
            return (
              <Typography
                style={{
                  margin: "0 10px",
                  padding: "0 10px",
                  cursor: "pointer",
                }}
                key={index}
                onClick={() => setSortBy(item.type)}
              >
                {item.title}
              </Typography>
            );
          })}
          <div>
            <TextField
              select
              defaultValue={order}
              style={{ padding: "10px", margin: "0 10px" }}
              onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            >
              <MenuItem value="desc">เรียงลำดับ: มากไปน้อย</MenuItem>
              <MenuItem value="asc">เรียงลำดับ: น้อยไปมาก</MenuItem>
            </TextField>
          </div>
        </div>
      </SearchSection>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Cateagory>
          <Typography variant="h5">หมวดหมู่</Typography>
          {allCategory.map((item, index) => {
            return (
              <Typography
                key={index}
                style={{ margin: "5px 0", padding: "5px", cursor: "pointer" }}
                onClick={() => setSelectedCategory(item)}
              >
                {item.category_name}
              </Typography>
            );
          })}
        </Cateagory>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
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
          </Grid>

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
    </div>
  );
};

export default ListProduct;
