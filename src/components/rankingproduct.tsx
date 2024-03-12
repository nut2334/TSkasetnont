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
import { Grid } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RankingproductChart = (prop: {
  data: {
    category_name: string;

    product_name: string;
    total_price: number;
    total_quantity: number;
  }[];
  rankingType: "quantity" | "price";
  rankingLimit: 10 | 20 | 30 | 40 | 50;
}) => {
  const [showData, setShowData] = useState<
    {
      category_name: string;
      product_name: string;
      total_price: number;
      total_quantity: number;
    }[]
  >();
  useEffect(() => {
    if (prop.rankingType === "quantity")
      // with ranking limit

      setShowData(
        prop.data
          .slice(0, prop.rankingLimit)
          .sort((a, b) => Number(b.total_quantity) - Number(a.total_quantity))
      );
    else
      setShowData(
        prop.data
          .slice(0, prop.rankingLimit)
          .sort((a, b) => Number(b.total_price) - Number(a.total_price))
      );
  }, [prop.rankingType, prop.data, prop.rankingLimit]);
  return (
    <>
      {showData && (
        <Bar
          data={{
            labels: prop.data.map((data) => data.product_name), //prop.data.map((data) => data.category_name),
            datasets: [
              {
                label: prop.rankingType === "quantity" ? "จำนวน" : "ราคา",
                data: showData.map((data) => data.total_quantity),
                //green
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          }}
          options={{
            indexAxis: "y" as const,
            elements: {
              bar: {
                borderWidth: 2,
              },
            },
            responsive: true,
            plugins: {
              legend: {
                position: "right" as const,
              },
              title: {
                display: true,
                text: "ยอดการขายสินค้าทั้งหมดของร้านค้าคุณ",
              },
            },
          }}
        />
      )}
    </>
  );
};

export default RankingproductChart;
