import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import React, { useEffect } from "react";
import * as config from "../../config/config";
import PieChart from "../../components/pie";
import { Bar } from "react-chartjs-2";
import BarChart from "../../components/bar";
import axios from "axios";
import FollowChart from "../../components/followchart";
import Pricecenter from "./pricecenter";

const Analyze = (prop: { jwt_token: string }) => {
  const [farmerDetail, setFarmerDetail] = React.useState<{
    firstname: string;
    lastname: string;
    farmerstorename: string;
    phone: string;
    email: string;
    createAt: string;
    product_count: number;
  }>();
  const [today, setToday] = React.useState<number>(0);
  const [saleData, setSaleData] = React.useState<
    {
      date: string;
      order_sale: number;
      categories: {
        category_name: string;
        order_sale: number;
        bgcolor: string;
      }[];
    }[]
  >();
  const [follower, setFollower] = React.useState<
    {
      createAt: string;
      follow_count: number;
    }[]
  >([]);
  const [allfollowers, setAllfollowers] = React.useState<number>(0);
  const [chartType, setChartType] = React.useState<"date" | "month">("date");

  useEffect(() => {
    const apiFollowMember = config.getApiEndpoint("allfollowers", "GET");
    const apiSelfInfo = config.getApiEndpoint("farmerselfinfo", "GET");
    axios
      .get(apiFollowMember, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        let follower: {
          createAt: string;
          follow_count: number;
        }[] = res.data.followers;

        setAllfollowers(res.data.allfollowers);
        setFollower(follower);
      });
    axios
      .get(apiSelfInfo, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        let selfData: {
          firstname: string;
          lastname: string;
          farmerstorename: string;
          phone: string;
          email: string;
          createAt: string;
          product_count: number;
        } = res.data.farmers[0];
        console.log(selfData);

        setFarmerDetail(selfData);
      });
  }, []);

  useEffect(() => {
    const apiOrder = config.getApiEndpoint(`getordersale/${chartType}`, "GET");
    axios
      .get(apiOrder, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        setSaleData(response.data.orders);
        setToday(response.data.today);
      });
  }, [chartType]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 1,
        marginBottom: 5,
      }}
    >
      <Grid container spacing={3}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          {farmerDetail && (
            <Grid
              sx={{ display: "flex", flexDirection: "column", width: "35%" }}
            >
              <Typography variant="h3">
                ยินดีต้อนรับ {farmerDetail.farmerstorename}
              </Typography>
              {/* ข้อมูลพื้นฐาน */}
              <Typography variant="h4">ข้อมูลพื้นฐาน</Typography>
              <Typography variant="h5">
                ชื่อ: {farmerDetail.firstname} {farmerDetail.lastname}
              </Typography>
              <Typography variant="h5">
                เบอร์โทร: {farmerDetail.phone}
              </Typography>
              <Typography variant="h5">อีเมล: {farmerDetail.email}</Typography>
              <Typography variant="h5">
                วันที่เริ่มใช้งาน:{" "}
                {new Date(farmerDetail.createAt).toLocaleDateString()}
              </Typography>
              <Typography variant="h5">
                จำนวนสินค้าทั้งหมด: {farmerDetail.product_count} ชิ้น
              </Typography>
            </Grid>
          )}
          <Box
            sx={{
              width: "65%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">
              ยอดผู้ติดตามทั้งหมด {allfollowers} คน
            </Typography>
            <FollowChart follower={follower} />
          </Box>
        </Box>
        <Divider
          sx={{
            width: "100%",
            margin: 2,
          }}
        />
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4">
              ยอดขาย{chartType === "date" ? "วันนี้ " : "เดือนนี้ "}
              {today} รายการ
            </Typography>
            <Grid>
              <Button
                variant="contained"
                color="info"
                onClick={() => setChartType("date")}
              >
                รายวัน
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => setChartType("month")}
              >
                รายเดือน
              </Button>
            </Grid>
          </Box>

          {saleData && <BarChart data={saleData} />}
        </Grid>
      </Grid>
      <Pricecenter />
    </Container>
  );
};

export default Analyze;
