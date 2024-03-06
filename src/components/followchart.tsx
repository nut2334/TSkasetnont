import React, { useEffect } from "react";
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
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        max:
          prop.follower.length > 0
            ? Math.max(
                ...prop.follower.map((follower) => follower.follow_count)
              ) + 10
            : 10,
      },
    },
  };
  useEffect(() => {
    console.log(prop.follower);
  }, [prop.follower]);
  return (
    <>
      {prop.follower.length > 0 && (
        <div>
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
          ;
        </div>
      )}
    </>
  );
};

export default FollowChart;
