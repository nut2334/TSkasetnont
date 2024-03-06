import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const Pricecenter = () => {
  const [data, setData] = useState<
    {
      category_name: string;
      product_name: string;
      sell_type: string;
      product_id: string;
    }[]
  >([]);
  const [category, setCategory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedSellType, setSelectedSellType] = useState<string>("");
  const [product_id, setProduct_id] = useState<string>("");

  useEffect(() => {
    axios
      .get("https://dataapi.moc.go.th/gis-products")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setCategory(
          res.data
            .map((item: { category_name: string }) => item.category_name)
            .filter((value: string, index: number, self: string[]) => {
              return self.indexOf(value) === index;
            })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const send = () => {
    const date = new Date();
    axios
      .get(
        ` https://dataapi.moc.go.th/gis-product-prices?product_id=${product_id}&from_date=${date.getFullYear()}-${
          date.getMonth() - 2
        }-01&to_date=${date.getFullYear()}-${date.getMonth()}-01`
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <>
      <Grid item xs={6}>
        <TextField
          select
          label="หมวดหมู่"
          fullWidth
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {category.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {selectedCategory !== "" && (
        <Grid item xs={6}>
          <TextField
            select
            label="สินค้า"
            fullWidth
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {data
              .filter((item) => item.category_name === selectedCategory)
              .map((item, index) => (
                <MenuItem key={index} value={item.product_name}>
                  {item.product_name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
      )}
      {selectedProduct !== "" && (
        <Grid item xs={12}>
          <TextField
            select
            label="ประเภทการขาย"
            fullWidth
            onChange={(e) => {
              setSelectedSellType(e.target.value);
              setProduct_id(
                data.filter(
                  (item) =>
                    item.product_name === selectedProduct &&
                    item.sell_type === selectedSellType
                )[0].product_id
              );
            }}
          >
            {data
              .filter((item) => item.product_name === selectedProduct)
              .map((item, index) => (
                <MenuItem key={index} value={item.sell_type}>
                  {item.sell_type}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
      )}
    </>
  );
};

export default Pricecenter;
