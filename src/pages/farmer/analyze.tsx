import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  Select,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import * as config from "../../config/config";
import PieChart from "../../components/pie";
import { Bar } from "react-chartjs-2";
import BarChart from "../../components/bar";
import axios from "axios";
import FollowChart from "../../components/followchart";
import Pricecenter from "./pricecenter";
import RankingproductChart from "../../components/rankingproduct";

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
  const [allSum, setAllSum] = React.useState();
  const [chartType, setChartType] = React.useState<"date" | "month">("date");
  const [rankingLimit, setRankingLimit] = React.useState<
    10 | 20 | 30 | 40 | 50
  >(10);
  const [rankingType, setRankingType] = React.useState<"quantity" | "price">(
    "quantity"
  );

  useEffect(() => {
    const apiFollowMember = config.getApiEndpoint("allfollowers", "GET");
    const apiSelfInfo = config.getApiEndpoint("farmerselfinfo", "GET");
    const apiAllsum = config.getApiEndpoint("allsum", "GET");
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
        console.log(res.data);

        setFarmerDetail(selfData);
      });
    axios
      .get(apiAllsum, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setAllSum(res.data.data);
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
        {farmerDetail && (
          <Grid
            xs={12}
            sx={{ display: "flex", flexDirection: "column", width: "35%" }}
          >
            <Typography variant="h4">
              ยินดีต้อนรับ {farmerDetail.farmerstorename}
            </Typography>
            <Divider
              sx={{
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            {/* ข้อมูลพื้นฐาน */}
            <Typography variant="h5">ข้อมูลพื้นฐาน</Typography>
            <Typography variant="subtitle1">
              ชื่อ: {farmerDetail.firstname} {farmerDetail.lastname}
            </Typography>
            <Typography variant="subtitle1">
              เบอร์โทร: {farmerDetail.phone}
            </Typography>
            <Typography variant="subtitle1">
              อีเมล: {farmerDetail.email}
            </Typography>
            <Typography variant="subtitle1">
              วันที่เริ่มใช้งาน:{" "}
              {new Date(farmerDetail.createAt).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1">
              จำนวนสินค้าทั้งหมด: {farmerDetail.product_count} ชิ้น
            </Typography>
            <Divider
              sx={{
                marginTop: 2,
                marginBottom: 2,
              }}
            />
          </Grid>
        )}
        <Box>
          <Typography variant="h5">ยอดขายทั้งหมด</Typography>
          <Button
            variant="contained"
            color="info"
            sx={{ marginRight: 1 }}
            onClick={() => setRankingType("quantity")}
          >
            จำนวน
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => setRankingType("price")}
          >
            ราคา
          </Button>
          {/* ranking limit */}
          <TextField
            select
            value={rankingLimit}
            onChange={(e) =>
              setRankingLimit(Number(e.target.value) as 10 | 20 | 30 | 40 | 50)
            }
            sx={{ marginLeft: 2 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
        </Box>

        {allSum && (
          <RankingproductChart
            data={allSum}
            rankingType={rankingType}
            rankingLimit={rankingLimit}
          />
        )}
        {/* <BarChart data={allSum} /> */}
        <Grid xs={12}>
          <Typography variant="h5">
            ยอดผู้ติดตามทั้งหมด {allfollowers} คน
          </Typography>
        </Grid>
        <Grid xs={12}>
          <FollowChart follower={follower} />
        </Grid>
        <Grid xs={12}>
          <Divider
            sx={{
              width: "100%",
              margin: 2,
            }}
          />
        </Grid>
        <Grid
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5">
            ยอดขาย{chartType === "date" ? "วันนี้ " : "เดือนนี้ "}
            {today} รายการ
          </Typography>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="info"
            onClick={() => setChartType("date")}
            sx={{ marginRight: 1 }}
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
        <Grid xs={12}>{saleData && <BarChart data={saleData} />}</Grid>
        <Grid xs={12}>
          <Divider
            sx={{
              width: "100%",
              margin: 2,
            }}
          />
        </Grid>
        <Grid xs={12}>
          <Typography variant="h5">ราคากลาง</Typography>
        </Grid>

        <Pricecenter />
      </Grid>
    </Container>
  );
};

export default Analyze;
