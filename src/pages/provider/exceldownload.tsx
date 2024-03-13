import {
  Box,
  Button,
  Table,
  Typography,
  Grid,
  Container,
  Divider,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as config from "../../config/config";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import EnhancedTable from "../../components/sortabletable";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const ExcelDownload = (prop: { jwt_token: string }) => {
  const [registerData, setRegisterData] = useState<
    { createAt: string; register_count: number }[]
  >([]);
  const [pieChart, setPieChart] = useState<
    { label: string; data: number; bgcolor: string }[]
  >([]);
  const [max, setMax] = useState<number>(0);
  const [farmerData, setFarmerData] = useState<
    {
      id: number;
      createAt: string;
      email: string;
      farmerstorename: string;
      firstname: string;
      lastname: string;
      phone: string;
      product_count: number;
    }[]
  >([]);
  const downloadExcel = () => {
    const apiExcelDownload = config.getApiEndpoint("excel", "GET");
    axios
      .get(apiExcelDownload, {
        responseType: "blob",
      })
      .then((response) => {
        console.log(response);

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `TheBestKasetNont-รายชื่อและข้อมูลของเกษตกรที่อยู่ในระบบ(${
            new Date().toISOString().split("T")[0]
          }).xlsx`
        );
        document.body.appendChild(link);
        link.click();
      });
  };

  useEffect(() => {
    const apiFarmerRegister = config.getApiEndpoint("farmerregister", "GET");
    const apiCategoryCount = config.getApiEndpoint("allcategories", "GET");
    const apiFarmerInfo = config.getApiEndpoint("farmerinfo", "GET");
    axios
      .get(apiFarmerRegister, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        let farmers: {
          createAt: string;
          register_count: number;
        }[] = res.data.farmers;
        let max = Math.max(...farmers.map((data) => data.register_count));
        setMax(max);
        setRegisterData(farmers);
      });
    axios
      .get(apiCategoryCount, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        let categories: { label: string; data: number; bgcolor: string }[] =
          res.data.categories;
        setPieChart(categories);
      });

    axios
      .get(apiFarmerInfo, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        let farmers: {
          createAt: string;
          email: string;
          farmerstorename: string;
          firstname: string;
          lastname: string;
          phone: string;
          product_count: number;
        }[] = res.data.farmers;

        setFarmerData(
          farmers.map((farmer, index) => {
            return {
              id: index,
              createAt: farmer.createAt,
              email: farmer.email,
              farmerstorename: farmer.farmerstorename,
              firstname: farmer.firstname,
              lastname: farmer.lastname,
              phone: farmer.phone,
              product_count: farmer.product_count,
            };
          })
        );
      });
  }, []);
  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 5,
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          display={{ xs: "none", md: "flex" }}
          sx={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">สถิติการลงทะเบียนเกษตกร</Typography>
        </Grid>
        <Grid item xs={12} display={{ xs: "flex", md: "none" }}>
          <Typography variant="h5">สถิติการลงทะเบียนเกษตกร</Typography>
        </Grid>

        <Grid item xs={12}>
          {registerData && (
            <Typography variant="h6" align="center">
              {`จำนวนเกษตกรที่ลงทะเบียนทั้งหมด: ${registerData.reduce(
                (acc, cur) => acc + cur.register_count,
                0
              )}`}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {registerData && (
            <Line
              options={{
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    ticks: {
                      stepSize: 1,
                    },
                    max: max > 0 ? max + Math.ceil(max * 0.2) : 5,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  title: {
                    display: true,
                    text: `จำนวนเกษตกรที่ลงทะเบียนในแต่ละวัน ในช่วง${
                      registerData.length > 0
                        ? `${new Date(
                            registerData[0].createAt
                          ).toLocaleDateString()} ถึง ${new Date(
                            registerData[registerData.length - 1].createAt
                          ).toLocaleDateString()}`
                        : ""
                    }`,
                    font: {
                      size: 15,
                    },
                  },
                },
              }}
              data={{
                labels: registerData.map((d) =>
                  new Date(d.createAt).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "จำนวนเกษตกร",
                    data: registerData.map((d) => d.register_count),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {pieChart && (
            <Pie
              data={{
                labels: pieChart.map((d) => d.label),
                datasets: [
                  {
                    label: "ยอดขาย",
                    data: pieChart.map((d) => d.data),
                    backgroundColor: pieChart.map((d) => {
                      let color = d.bgcolor
                        ? JSON.parse(d.bgcolor)
                        : {
                            r: Math.random() * 255,
                            g: Math.random() * 255,
                            b: Math.random() * 255,
                            a: 0.5,
                          };

                      return `rgba(${color.r},${color.g},${color.b},${color.a})`;
                    }),
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  title: {
                    display: true,
                    text: "จำนวนสินค้าในระบบ",
                  },
                },
              }}
            />
          )}
        </Grid>
        {/* <Grid item xs={12} margin={2}>
          <Button
            onClick={downloadExcel}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Excel Download
          </Button>
        </Grid> 
        <Grid item xs={12}>
          {farmerData && (
            // <EnhancedTable rows={farmerData} />

            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>ชื่อร้านค้า</StyledTableCell>
                    <StyledTableCell>ชื่อ</StyledTableCell>
                    <StyledTableCell align="right">นามสกุล</StyledTableCell>
                    <StyledTableCell align="right">อีเมล</StyledTableCell>
                    <StyledTableCell align="right">เบอร์โทร</StyledTableCell>
                    <StyledTableCell align="right">
                      เป็นสมาชิกตั้งแต่
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      สินค้าในระบบ
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {farmerData.map((row) => (
                    <StyledTableRow key={row.email}>
                      <StyledTableCell component="th" scope="row">
                        {row.farmerstorename}
                      </StyledTableCell>
                      <StyledTableCell>{row.firstname}</StyledTableCell>
                      <StyledTableCell align="right">
                        {row.lastname}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.phone}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {new Date(row.createAt).toLocaleDateString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.product_count}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default ExcelDownload;
