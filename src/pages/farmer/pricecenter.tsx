import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, MenuItem, TextField, Typography, Divider } from "@mui/material";
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
        if (res.data.error) {
          setGraph([]);
          return;
        }
        setUnit(res.data.unit);
        setGraph(res.data.price_list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {category.length > 0 && (
        <>
          <Grid xs={12}>
            <Divider textAlign="left">
              <Typography>ตรวจสอบราคากลาง</Typography>
            </Divider>
          </Grid>
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
        </>
      )}
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
        <Grid item xs={6}>
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
          <Grid item xs={6}>
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
      {graph.length > 0 ? (
        <Line
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
                labels: {
                  font: {
                    size: 20,
                    family: "Kanit",
                  },
                },
              },
              title: {
                display: true,

                text: `ราคากลางสินค้า ณ ช่วงวันที่ ${new Date(
                  graph[0].date
                ).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} ถึง ${new Date(
                  graph[graph.length - 1].date
                ).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} (${unit}) `,
                font: {
                  size: 20,
                  family: "Kanit",
                },
              },
              tooltip: {
                bodyFont: {
                  size: 20,
                  family: "Kanit",
                },
                titleFont: {
                  size: 20,
                  family: "Kanit",
                },
              },
            },
          }}
          data={{
            labels: graph.map((d) =>
              new Date(d.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            ),
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
      ) : selectedSellType !== "" && !(graph.length > 0) ? (
        <Grid item xs={12} textAlign="center">
          <Typography
            sx={{
              color: "gray",
            }}
          >
            ยังไม่มีข้อมูลราคาสินค้าในช่วงเวลานี้
          </Typography>
        </Grid>
      ) : null}
    </>
  );
};

export default Pricecenter;
