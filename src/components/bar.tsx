import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Grid, Typography } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = (prop: {
  data: {
    date: string;
    order_sale: number;
    categories: {
      category_name: string;
      order_sale: number;
      bgcolor: string;
    }[];
  }[];
}) => {
  const [category, setCategory] = useState<
    {
      category_name: string;
      bgcolor: string;
    }[]
  >([]);
  const [max, setMax] = useState<number>(0);

  useEffect(() => {
    let category: {
      category_name: string;
      bgcolor: string;
    }[] = [];
    prop.data.forEach((data: any) => {
      data.categories.forEach((cate: any) => {
        let check = false;
        category.forEach((cat) => {
          if (cat.category_name === cate.category_name) {
            check = true;
          }
        });
        if (!check) {
          category.push({
            category_name: cate.category_name,
            bgcolor: cate.bgcolor,
          });
        }
      });
    });
    setCategory(category);
    let max = Math.max(...prop.data.map((data) => data.order_sale));
    setMax(max);
  }, [prop.data]);

  const options = {
    scales: {
      x: {
        stacked: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 20,
            family: "Kanit",
          },
        },
      },
      y: {
        stacked: true,
        ticks: {
          stepSize: 1,
        },
        font: {
          size: 20,
          family: "Kanit",
        },
        max: max > 0 ? max + Math.ceil(max * 0.2) : 5,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
        labels: {
          font: {
            size: 20,
            family: "Kanit",
          },
        },
      },
      title: {
        display: true,
        text: "จำนวนยอดขายตามหมวดหมู่",
        align: "start" as const,
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
  };
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {prop.data && (
        <Bar
          style={{
            filter: `${max === 0 ? "blur(5px)" : "none"}`,
          }}
          data={{
            labels: prop.data.map((data) => {
              let spilt = data.date.split("/");
              if (spilt.length === 3) {
                return new Date(data.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }

              let allMonth = [
                "มกราคม",
                "กุมภาพันธ์",
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม",
              ];

              return `${allMonth[parseInt(spilt[0]) - 1]} ${
                parseInt(spilt[1]) + 543
              }`;
            }),
            datasets: [
              ...category.map((cate) => {
                let color = cate.bgcolor
                  ? JSON.parse(cate.bgcolor)
                  : {
                      r: Math.floor(Math.random() * 256),
                      g: Math.floor(Math.random() * 256),
                      b: Math.floor(Math.random() * 256),
                      a: 0.5,
                    };
                return {
                  label: cate.category_name,
                  data: prop.data.map((data) => {
                    let order_sale = 0;
                    data.categories.forEach((category) => {
                      if (category.category_name === cate.category_name) {
                        order_sale = category.order_sale;
                      }
                    });
                    return order_sale;
                  }),
                  backgroundColor: `rgba(${color.r},${color.g},${color.b},${color.a})`,
                  borderColor: `rgba(${color.r},${color.g},${color.b},${color.a})`,
                  borderWidth: 1,
                };
              }),
            ],
          }}
          options={options}
        ></Bar>
      )}
      {max === 0 && (
        <Grid
          xs={12}
          item
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textAlign: "center",
          }}
        >
          <Typography>ไม่มีข้อมูลการขาย</Typography>
        </Grid>
      )}
    </div>
  );
};

export default BarChart;
