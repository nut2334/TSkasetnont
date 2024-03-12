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
import { Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import { SearchOutlined } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { string } from "yargs";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
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
  const [unit, setUnit] = useState<string>("");
  const [graph, setGraph] = useState<
    { date: string; price_min: number; price_max: number }[]
  >([]);

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
        }-01&to_date=${date.getFullYear()}-${date.getMonth()}-${
          date.getDate() - 1
        }`
      )
      .then((res) => {
        console.log(res.data);
        setUnit(res.data.unit);
        setGraph(res.data.price_list);
      });
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="หมวดหมู่"
          fullWidth
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProduct("");
            setSelectedSellType("");
          }}
        >
          {category.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {selectedCategory !== "" && (
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="สินค้า"
            fullWidth
            onChange={(e) => {
              setSelectedProduct(e.target.value);
              setSelectedSellType("");
            }}
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
                    item.sell_type === e.target.value
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
      {product_id !== "" && (
        <>
          <Grid item xs={12}>
            <Button
              onClick={send}
              startIcon={<SearchOutlined />}
              variant="contained"
              color="info"
            >
              ค้นหา
            </Button>
          </Grid>
        </>
      )}
      {graph.length > 0 && (
        <Line
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: `ราคากลางสินค้า ณ ปัจจุบัน (${unit})`,
              },
            },
          }}
          data={{
            labels: graph.map((d) => new Date(d.date).toLocaleDateString()),
            datasets: [
              {
                label: "ราคาต่ำสุด",
                data: graph.map((d) => d.price_min),
                fill: 1,
                backgroundColor: "rgba(255, 99, 132,0.2)",
                borderColor: "rgba(255, 99, 132, 0.2)",
              },
              {
                label: "ราคาสูงสุด",
                data: graph.map((d) => d.price_max),
                fill: false,
                backgroundColor: "rgb(54, 162, 235)",
                borderColor: "rgba(54, 162, 235, 0.2)",
              },
            ],
          }}
        />
      )}
    </>
  );
};

export default Pricecenter;
