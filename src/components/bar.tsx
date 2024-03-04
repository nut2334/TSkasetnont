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

const BarChart = (prop: { jwt_token: string }) => {
  const [dataMonth, setDataMonth] = useState<
    {
      date: string;
      order_sale: number;
      categories: {
        category_name: string;
        order_sale: number;
        bgcolor: string;
      }[];
    }[]
  >([]);
  const [category, setCategory] = useState<
    {
      category_name: string;
      bgcolor: string;
    }[]
  >([]);
  const [dataYear, setDataYear] = useState<
    {
      date: string;
      order_sale: number;
      categories: {
        category_name: string;
        order_sale: number;
        bgcolor: string;
      }[];
    }[]
  >([]);

  useEffect(() => {
    const apiOrder = config.getApiEndpoint("getordersale/date", "GET");
    axios
      .get(apiOrder, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        setDataMonth(response.data.orders);
        //checkCategory
        let category: {
          category_name: string;
          bgcolor: string;
        }[] = [];
        response.data.orders.forEach((data: any) => {
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
      });
    const apiOrderYear = config.getApiEndpoint("getordersale/month", "GET");
    axios
      .get(apiOrderYear, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setDataYear(response.data.orders);
      });
  }, []);

  const mockDataMonth = {
    labels: dataMonth?.map((data) => data.date),
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
          data: dataMonth?.map((data) => {
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
  } as any;

  const mockData = {
    labels: dataYear?.map((data) => data.date),
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
          data: dataYear?.map((data) => {
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
  } as any;

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  return (
    <div>
      {dataMonth && <Bar data={mockDataMonth} options={options}></Bar>}
      {dataYear && <Bar data={mockData} options={options}></Bar>}
    </div>
  );
};

export default BarChart;
