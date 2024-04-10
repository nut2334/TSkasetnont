import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import * as config from "../../config/config";
import BarChart from "../../components/bar";
import axios from "axios";
import FollowChart from "../../components/followchart";
import RankingproductChart from "../../components/rankingproduct";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Yearlybar from "../../components/yearlybar";
import { status_buy } from "../../config/dataDropdown";
import { status_reserve } from "../../config/dataDropdown";

interface Saletoday {
  category_name: string;
  member_id: string;
  product_id: string;
  product_name: string;
  total_price: string;
  total_quantity: number;
  username: string;
  id: string;
  price: string;
  status: string;
}
interface Reservetoday {
  category_name: string;
  contact: string;
  member_id: string;
  product_id: string;
  product_name: string;
  total_quantity: number;
  id: string;
  username: string;
  status: string;
}

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
  const [buyToday, setBuyToday] = React.useState<Saletoday[]>();
  const [reserveToday, setReserveToday] = React.useState<Reservetoday[]>();
  const [yearlyReserve, setYearlyReserve] = React.useState<
    {
      product_name: string;
      product_id: string;
    }[]
  >([]);
  const [selectedYearlyReserve, setSelectedYearlyReserve] = React.useState<{
    product_name: string;
    product_id: string;
  }>();
  const [allReserve, setAllReserve] = React.useState<
    {
      product_id: string;
      product_name: string;
      period: string;
    }[]
  >([]);
  const [productId, setProductId] = React.useState<{
    product_id: string;
    product_name: string;
    period: string;
  }>();
  const [reserveTable, setReserveTable] = React.useState<Reservetoday[]>([]);

  useEffect(() => {
    const apiFollowMember = config.getApiEndpoint("allfollowers", "GET");
    const apiSelfInfo = config.getApiEndpoint("farmerselfinfo", "GET");
    const apiAllsum = config.getApiEndpoint("allsum", "GET");
    const apiReserveProduct = config.getApiEndpoint("reserveproduct", "GET");
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
    axios
      .get(config.getApiEndpoint("todaybuy", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        setBuyToday(
          res.data.map((order: Saletoday, index: number) => {
            return {
              ...order,
              id: index,
              status: status_buy.find(
                (status) => status.statusID === order.status
              )?.statusName,
            };
          })
        );
      });
    axios
      .get(config.getApiEndpoint("todayreserve", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setReserveToday(
          res.data.map((order: Reservetoday, index: number) => {
            return {
              ...order,
              id: index,
              status: status_reserve.find(
                (status) => status.statusID === order.status
              )?.statusName,
            };
          })
        );
      });
    axios
      .get(config.getApiEndpoint("reserveproduct/เปิดรับจองตลอด", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        setYearlyReserve(res.data);
      });
    axios
      .get(config.getApiEndpoint("reserveproduct/all", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllReserve(res.data);
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

  useEffect(() => {
    if (productId?.product_id === "") return;
    axios
      .get(
        config.getApiEndpoint(`reservetable/${productId?.product_id}`, "GET"),
        {
          headers: {
            Authorization: `Bearer ${prop.jwt_token}`,
          },
        }
      )
      .then((res) => {
        setReserveTable(
          res.data.map((order: Reservetoday, index: number) => {
            return {
              ...order,
              id: index,
              status: status_reserve.find(
                (status) => status.statusID === order.status
              )?.statusName,
            };
          })
        );
      });
  }, [productId]);

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
              {new Date(farmerDetail.createAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="subtitle1">
              จำนวนสินค้าทั้งหมด: {farmerDetail.product_count} ชิ้น
            </Typography>
            <Divider
              sx={{
                marginTop: 2,
                marginBottom: 2,
              }}
              textAlign="left"
            >
              <Typography>สินค้าที่จัดส่งพัสดุ</Typography>
            </Divider>
          </Grid>
        )}
        <Grid xs={12}>
          <Typography variant="h5">
            สินค้าที่ขายไปวันนี้ {today} รายการ
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography>
            ณ วันที่{" "}
            {new Date().toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <DataGrid
            rows={buyToday ? buyToday : []}
            columns={[
              { field: "username", headerName: "ชื่อผู้ใช้", flex: 1 },
              { field: "product_name", headerName: "ชื่อสินค้า", flex: 1 },
              { field: "price", headerName: "ราคา", flex: 1 },
              { field: "total_quantity", headerName: "จำนวน", flex: 1 },
              { field: "total_price", headerName: "ราคาทั้งหมด", flex: 1 },
              { field: "status", headerName: "สถานะ", flex: 1 },
            ]}
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
        {saleData && (
          <Grid xs={12}>
            {chartType === "date" ? (
              <Typography>
                ข้อมูลช่วงวันที่{" "}
                {new Date(saleData[0].date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                ถึง{" "}
                {new Date(
                  saleData[saleData.length - 1].date
                ).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            ) : (
              <Typography>
                ข้อมูลเดือน{" "}
                {new Date(
                  saleData[0].date.split("/")[0] +
                    "/1/" +
                    saleData[0].date.split("/")[1]
                ).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                })}{" "}
                ถึง{" "}
                {new Date(
                  saleData[saleData.length - 1].date.split("/")[0] +
                    "/1/" +
                    saleData[saleData.length - 1].date.split("/")[1]
                ).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                })}
              </Typography>
            )}
          </Grid>
        )}
        <Grid xs={12}>{saleData && <BarChart data={saleData} />}</Grid>

        <Grid xs={12}>
          <Divider
            sx={{
              marginTop: 2,
              marginBottom: 2,
            }}
            textAlign="left"
          >
            <Typography>จองสินค้า</Typography>
          </Divider>
        </Grid>

        {/* <Box>
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
        )} */}

        <Grid xs={12}>
          <Typography variant="h5">
            การจองสินค้าวันนี้ {reserveToday ? reserveToday.length : "0"} รายการ
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography>
            ณ วันที่{" "}
            {new Date().toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            rows={reserveToday ? reserveToday : []}
            columns={[
              { field: "username", headerName: "ชื่อผู้ใช้", flex: 1 },
              { field: "contact", headerName: "ติดต่อ", flex: 1 },
              { field: "product_name", headerName: "ชื่อสินค้า", flex: 1 },
              { field: "total_quantity", headerName: "จำนวน", flex: 1 },
              { field: "status", headerName: "สถานะ", flex: 1 },
            ]}
          />
        </Grid>
        {productId?.period && (
          <Grid xs={12} sx={{ marginTop: 2 }}>
            <Typography variant="h5">
              การจองสินค้า{"(" + productId.product_name + ") "}ตัดรอบทุก{" "}
              {new Date(productId.period).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
              })}{" "}
              ทั้งหมด {reserveTable ? reserveTable.length : "0"} รายการ
            </Typography>
          </Grid>
        )}
        <Grid item xs={6}>
          <TextField fullWidth select label="รายการสินค้าจอง">
            {allReserve.map((product) => (
              <MenuItem
                value={product.product_id}
                onClick={() => setProductId(product)}
              >
                {product.product_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            rows={reserveTable ? reserveTable : []}
            columns={[
              { field: "username", headerName: "ชื่อผู้ใช้", flex: 1 },
              { field: "contact", headerName: "ติดต่อ", flex: 1 },
              { field: "product_name", headerName: "ชื่อสินค้า", flex: 1 },
              { field: "total_quantity", headerName: "จำนวน", flex: 1 },
              { field: "status", headerName: "สถานะ", flex: 1 },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            ยอดรวมสินค้าทั้งหมด{" "}
            {reserveTable.reduce((acc, order) => acc + order.total_quantity, 0)}{" "}
            ชิ้น
          </Typography>
          <Typography>
            ยอดรวมสินค้าที่อนุมัติแล้ว{" "}
            {reserveTable.reduce((acc, order) => {
              if (order.status === "สำเร็จ") {
                return acc + order.total_quantity;
              }
              return acc;
            }, 0)}{" "}
            ชิ้น
          </Typography>
        </Grid>
      </Grid>
      {selectedYearlyReserve && (
        <Grid xs={12}>
          <Typography variant="h5">
            ยอดการจอง{selectedYearlyReserve.product_name}ประจำปี{" "}
          </Typography>
        </Grid>
      )}
      <Grid xs={6} sx={{ marginTop: 2 }}>
        <TextField select label="เลือกสินค้าการจอง" fullWidth>
          {yearlyReserve.map((product) => (
            <MenuItem
              value={product.product_id}
              onClick={() => setSelectedYearlyReserve(product)}
            >
              {product.product_name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid xs={12} sx={{ marginTop: 2 }}>
        {selectedYearlyReserve && (
          <Yearlybar
            jwt_token={prop.jwt_token}
            product_name={selectedYearlyReserve.product_name}
            product_id={selectedYearlyReserve.product_id}
          />
        )}
      </Grid>
      <Grid xs={12}>
        <Divider
          sx={{
            width: "100%",
            margin: 2,
          }}
          textAlign="left"
        >
          <Typography>ผู้ติดตาม</Typography>
        </Divider>
      </Grid>

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
    </Container>
  );
};

export default Analyze;
