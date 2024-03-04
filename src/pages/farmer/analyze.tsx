import { Container, Grid, Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import * as config from "../../config/config";
import PieChart from "../../components/pie";
import { Bar } from "react-chartjs-2";
import BarChart from "../../components/bar";
import axios from "axios";
import FollowChart from "../../components/followchart";

const Analyze = (prop: { jwt_token: string }) => {
  const apiOrder = config.getApiEndpoint("getordersale/date", "GET");

  const [today, setToday] = React.useState<number>(0);

  useEffect(() => {
    axios
      .get(apiOrder, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
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
          <Typography variant="h3">ยอดติดตาม 100 คน</Typography>
          <FollowChart />
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
      </Grid>
    </Container>
  );
};

export default Analyze;
