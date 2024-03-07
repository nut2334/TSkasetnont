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
import axios from "axios";
import * as config from "../config/config";
import { Chart } from "chart.js/dist";

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
  }, []);

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          stepSize: 1,
        },
        max: max > 0 ? max + Math.ceil(max * 0.2) : 5,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
      },
      title: {
        display: true,
        text: "จำนวนยอดขายตามหมวดหมู่",
        align: "start" as const,
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
            labels: prop.data.map((data) => data.date),
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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <h1>ไม่มีข้อมูลการขาย</h1>
        </div>
      )}
    </div>
  );
};

export default BarChart;
