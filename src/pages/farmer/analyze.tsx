import { Container, Grid, Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import * as config from "../../config/config";
import PieChart from "../../components/pie";
import { Bar } from "react-chartjs-2";
import BarChart from "../../components/bar";
import axios from "axios";
import FollowChart from "../../components/followchart";
import Pricecenter from "./pricecenter";

const Analyze = (prop: { jwt_token: string }) => {
  const apiOrder = config.getApiEndpoint("getordersale/date", "GET");
  const apiFollowMember = config.getApiEndpoint("allfollowers", "GET");

  const [today, setToday] = React.useState<number>(0);
  const [follower, setFollower] = React.useState<
    {
      createAt: string;
      follow_count: number;
    }[]
  >([]);
  const [allfollowers, setAllfollowers] = React.useState<number>(0);

  useEffect(() => {
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
      .get(apiOrder, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        setToday(response.data.today);
      });
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 1,
        marginBottom: 5,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3">
            ยอดผู้ติดตามทั้งหมด {allfollowers} คน
          </Typography>
          <FollowChart follower={follower} />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h4">ยอดขายวันนี้ {today} รายการ</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">ยอดขาย 30 วันล่าสุด</Typography>
          <Box
            sx={{
              padding: 2,
            }}
          >
            <BarChart jwt_token={prop.jwt_token} />
          </Box>
        </Grid>
        <Pricecenter />
      </Grid>
    </Container>
  );
};

export default Analyze;
