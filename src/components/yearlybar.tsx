import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import * as config from "../config/config";
import { Typography } from "@mui/material";
import { title } from "process";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 20,
          family: "Kanit",
        },
      },
    },
    title: {
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

const Yearlybar = (prop: {
  jwt_token: string;
  product_id: string;
  product_name: string;
}) => {
  const [data, setData] = useState<
    {
      year: string;
      count: string;
    }[]
  >([]);
  useEffect(() => {
    console.log(prop.product_id);
    let apiReserveyearly = config.getApiEndpoint(
      `reserveyearly/${prop.product_id}`,
      "GET"
    );
    axios
      .get(apiReserveyearly, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  }, [prop.product_id]);

  return (
    <>
      {data.length > 0 ? (
        <>
          <Typography variant="h6">
            <span>
              ยอดการจอง{prop.product_name}ประจำปี{" "}
              {data.length == 1
                ? parseInt(data[0].year) + 543
                : `${parseInt(data[0].year) + 543}` +
                  " - " +
                  `${parseInt(data[data.length - 1].year) + 543}`}
            </span>
          </Typography>
          <Bar
            data={{
              labels: data.map((d) => d.year + 543),
              datasets: [
                {
                  label: "ยอดการจองสินค้า",
                  data: data.map((d) => d.count),
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={options}
          />
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Yearlybar;
