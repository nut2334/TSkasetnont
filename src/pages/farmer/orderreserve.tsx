import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  ListItemText,
  ListItemIcon,
  Chip,
  ListItemButton,
  List,
  ListSubheader,
  Box,
  Collapse,
  ListItem,
  Divider,
} from "@mui/material";
import axios from "axios";
import * as config from "../../config/config";
import InboxIcon from "@mui/icons-material/Inbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";

interface OrderReserveInterface {
  id: string;
  reserve_products: productInterface;
  customer_info: {
    member_id: string;
    firstname: string;
    lastname: string;
    phone: string;
    line: string;
  };
  dates: string;
  dates_complete: string | null;
  status: string;
}
interface productInterface {
  product_id: string;
  quantity: number;
  product_name: string;
  unit: string;
}

const EachReserve = (prop: {
  order: OrderReserveInterface;
  jwt_token: string;
  fetchOrderHistory: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const { order } = prop;
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        style={{
          backgroundColor:
            order.status === "complete"
              ? "#D1F2EB"
              : order.status === "reject"
              ? "#FDEBD0"
              : order.status === "pending"
              ? "#D6EAF8"
              : "#FADBD8",

          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary={order.id} />
        <Chip
          label={
            order.status === "complete"
              ? "สำเร็จ"
              : order.status === "reject"
              ? "ยกเลิก"
              : "รอการตรวจสอบ"
          }
          style={{
            backgroundColor:
              order.status === "complete"
                ? "#58D68D"
                : order.status === "reject"
                ? "#F4D03F"
                : order.status === "pending"
                ? "#5DADE2"
                : "#EC7063",
            color: "white",
          }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
        }}
      >
        <List component="div" disablePadding>
          <ListSubheader>รายละเอียดการจอง</ListSubheader>
          <Box display={"flex"}>
            <ListItem alignItems="flex-start">
              <Box display={{ xs: "none", lg: "flex" }}>
                <ListItemText>
                  สถานะการจอง:{" "}
                  {order.status === "complete" ? (
                    <Chip label="สำเร็จ" color="success" />
                  ) : order.status === "pending" ? (
                    <Chip label="รอการตรวจสอบ" color="info" />
                  ) : (
                    <Chip label="ยกเลิก" color="error" />
                  )}
                </ListItemText>
              </Box>
            </ListItem>
            <Divider orientation="vertical" flexItem />
            <ListItem>
              <ListItemText
                primary={`วันที่จอง: ${new Date(order.dates).toLocaleDateString(
                  "th-TH",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`}
              />
            </ListItem>
            <Divider orientation="vertical" flexItem />
            <ListItem>
              <ListItemText
                primary={`วันที่สำเร็จ: ${
                  order.dates_complete
                    ? new Date(order.dates_complete).toLocaleDateString(
                        "th-TH",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "ยังไม่สำเร็จ"
                }`}
              />
            </ListItem>
          </Box>
          <Divider
            sx={{
              marginTop: "10px",
            }}
          />
          <ListSubheader>รายละเอียดผู้ซื้อ</ListSubheader>
          <Box
            display={{
              xs: "none",
              lg: "flex",
            }}
          >
            <Box display={"flex"}>
              <ListItem>
                <ListItemText>
                  ชื่อ : {order.customer_info.firstname}{" "}
                  {order.customer_info.lastname}
                </ListItemText>
              </ListItem>

              <Divider orientation="vertical" flexItem />
              <ListItem>
                <ListItemText>
                  เบอร์โทร : {order.customer_info.phone}
                </ListItemText>
              </ListItem>
              <Divider orientation="vertical" flexItem />
              <ListItem>
                <ListItemText>
                  LINE ID : {order.customer_info.line}
                </ListItemText>
              </ListItem>
              <Divider orientation="vertical" flexItem />
            </Box>
          </Box>
          <Box
            display={{
              xs: "flex",
              lg: "none",
            }}
          >
            <ListItem>
              <ListItemText>
                ชื่อ : {order.customer_info.firstname}{" "}
                {order.customer_info.lastname}
                <br />
                เบอร์โทร : {order.customer_info.phone}
                <br />
                LINE ID : {order.customer_info.line}
              </ListItemText>
            </ListItem>
          </Box>

          <Divider />
          <ListSubheader>สินค้าที่จอง</ListSubheader>
          <Box display={"flex"}>
            <ListItem
              sx={{
                display: "flex",
              }}
            >
              <ListItemText>
                ชื่อสินค้า : {order.reserve_products.product_name}
              </ListItemText>
              <ListItemText>
                จำนวน : {order.reserve_products.quantity}{" "}
                {order.reserve_products.unit}
              </ListItemText>

              <Box display={{ xs: "none", lg: "flex" }}>
                <ListItemText
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Chip
                    label="ปฎิเสธการจอง"
                    color="error"
                    disabled={
                      order.status === "reject" || order.status === "complete"
                        ? true
                        : false
                    }
                    sx={{
                      cursor: `${
                        order.status === "pending" ? "pointer" : "not-allowed"
                      }`,
                    }}
                    onClick={() => {
                      axios
                        .patch(
                          config.getApiEndpoint("reserve", "PATCH"),
                          {
                            status: "reject",
                            reserve_id: order.id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        )
                        .then((response) => {
                          console.log(response.data);
                          Swal.fire({
                            icon: "success",
                            title: "สำเร็จ",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                          prop.fetchOrderHistory();
                        })
                        .catch((error) => {
                          console.log(error);
                          Swal.fire({
                            icon: "error",
                            title: "ไม่สำเร็จ",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        });
                    }}
                  />
                  <Chip
                    sx={{
                      marginLeft: "10px",
                      cursor: `${
                        order.status === "pending" ? "pointer" : "not-allowed"
                      }`,
                    }}
                    label="ยอมรับการจอง"
                    color="success"
                    disabled={
                      order.status === "complete" || order.status === "reject"
                        ? true
                        : false
                    }
                    onClick={() => {
                      axios
                        .patch(
                          config.getApiEndpoint("reserve", "PATCH"),
                          {
                            status: "complete",
                            reserve_id: order.id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        )
                        .then((response) => {
                          console.log(response.data);
                          Swal.fire({
                            icon: "success",
                            title: "สำเร็จ",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                          prop.fetchOrderHistory();
                        })
                        .catch((error) => {
                          console.log(error);
                          Swal.fire({
                            icon: "error",
                            title: "ไม่สำเร็จ",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        });
                    }}
                  />
                </ListItemText>
              </Box>
            </ListItem>
            <Divider orientation="vertical" flexItem />
          </Box>
          <Box display={{ xs: "flex", lg: "none" }}>
            <ListItemText
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Chip
                label="ปฎิเสธการจอง"
                color="error"
                disabled={
                  order.status === "reject" || order.status === "complete"
                    ? true
                    : false
                }
                sx={{
                  cursor: `${
                    order.status === "pending" ? "pointer" : "not-allowed"
                  }`,
                }}
                onClick={() => {
                  axios
                    .patch(
                      config.getApiEndpoint("reserve", "PATCH"),
                      {
                        status: "reject",
                        reserve_id: order.id,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${prop.jwt_token}`,
                        },
                      }
                    )
                    .then((response) => {
                      console.log(response.data);
                      Swal.fire({
                        icon: "success",
                        title: "สำเร็จ",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      prop.fetchOrderHistory();
                    })
                    .catch((error) => {
                      console.log(error);
                      Swal.fire({
                        icon: "error",
                        title: "ไม่สำเร็จ",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    });
                }}
              />
              <Chip
                sx={{
                  marginLeft: "10px",
                  cursor: `${
                    order.status === "pending" ? "pointer" : "not-allowed"
                  }`,
                }}
                label="ยอมรับการจอง"
                color="success"
                disabled={
                  order.status === "complete" || order.status === "reject"
                    ? true
                    : false
                }
                onClick={() => {
                  axios
                    .patch(
                      config.getApiEndpoint("reserve", "PATCH"),
                      {
                        status: "complete",
                        reserve_id: order.id,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${prop.jwt_token}`,
                        },
                      }
                    )
                    .then((response) => {
                      console.log(response.data);
                      Swal.fire({
                        icon: "success",
                        title: "สำเร็จ",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      prop.fetchOrderHistory();
                    })
                    .catch((error) => {
                      console.log(error);
                      Swal.fire({
                        icon: "error",
                        title: "ไม่สำเร็จ",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    });
                }}
              />
            </ListItemText>
          </Box>
        </List>
      </Collapse>
    </>
  );
};
const Orderreserve = (prop: { jwt_token: string }) => {
  const [orderReserve, setOrderReserve] = React.useState<
    OrderReserveInterface[]
  >([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = () => {
    axios
      .get(config.getApiEndpoint("reserve", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setOrderReserve(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {orderReserve.length === 0 && <Typography>ไม่มีประวัติการจอง</Typography>}
      {orderReserve.map((order, index) => {
        return (
          <EachReserve
            key={index}
            order={order}
            jwt_token={prop.jwt_token}
            fetchOrderHistory={fetchOrderHistory}
          />
        );
      })}
    </>
  );
};

export default Orderreserve;
