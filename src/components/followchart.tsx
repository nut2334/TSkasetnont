import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const FollowChart = (prop: {
  follower: {
    createAt: string;
    follow_count: number;
  }[];
}) => {
  const [max, setMax] = useState<number>(0);
  useEffect(() => {
    let max = Math.max(...prop.follower.map((data) => data.follow_count));
    setMax(max);
  }, [prop.follower]);
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        max: max > 0 ? max + Math.ceil(max * 0.2) : 5,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
      },
      title: {
        display: true,
        text: "จำนวนยอดผู้ติดตาม",
        align: "end" as const,
      },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {prop.follower.length > 0 && (
        <Box
          sx={{
            filter: `${max === 0 ? "blur(5px)" : "none"}`,
          }}
        >
          <Line
            options={options}
            data={{
              labels: prop.follower.map((follower) => {
                return follower.createAt;
              }),
              datasets: [
                {
                  label: "Followers",
                  data: prop.follower.map((follower) => {
                    return follower.follow_count;
                  }),
                  fill: true,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)",
                },
              ],
            }}
          />
        </Box>
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

export default FollowChart;
