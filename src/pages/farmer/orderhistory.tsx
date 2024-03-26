import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as config from "../../config/config";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Chip,
  Container,
  ListItem,
  Pagination,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import AddCircle from "@mui/icons-material/AddCircle";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import TableBank from "../../components/tablebank";
import TextField from "@mui/material/TextField";
interface OrderHistoryInterface {
  order_id: string;
  products: productInterface[];
  tracking_number: string;
  customer_info: {
    member_id: string;
    firstname: string;
    lastname: string;
    phone: string;
    address: string;
  };
  date_buys: string;
  date_complete: string | null;
  total_amount: number;
  transaction_confirm: string;
  status: string;
  shippingcost: number;
}
interface productInterface {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

const EachOrder = (prop: {
  order: OrderHistoryInterface;
  jwt_token: string;
  fetchOrderHistory: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const { order } = prop;
  const handleClick = () => {
    setOpen(!open);
  };
  const [showTransaction, setShowTransaction] = useState(false);
  const [showTrackingNumber, setShowTrackingNumber] = useState(false);
  const [regTrackingNumber, setRegTrackingNumber] = useState(true);

  const showSweet = () => {
    withReactContent(Swal).fire({
      title: <i>เหตุผลการปฎิเสธ</i>,
      input: "text",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "บันทึก",
      preConfirm: () => {
        handleSubmit(Swal.getInput()?.value || "");
      },
    });
  };

  const handleSubmit = (comment: string) => {
    let apiConfirmOrder = config.getApiEndpoint("confirmorder", "POST");
    axios
      .post(
        apiConfirmOrder,
        {
          order_id: order.order_id,
          status: "reject",
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${prop.jwt_token}`,
          },
        }
      )
      .then((res) => {
        prop.fetchOrderHistory();
        setShowTransaction(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        style={{
          backgroundColor:
            order.status === "complete"
              ? "#D1F2EB"
              : order.status === "waiting"
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
        <ListItemText primary={order.order_id} />
        <Chip
          label={
            order.status === "complete"
              ? "สำเร็จ"
              : order.status === "waiting"
              ? "รอจัดส่ง"
              : order.status === "pending"
              ? "รอการตรวจสอบ"
              : order.status === "reject"
              ? "ยกเลิก"
              : ""
          }
          color={`${
            order.status === "complete"
              ? "success"
              : order.status === "waiting"
              ? "warning"
              : order.status === "pending"
              ? "info"
              : "error"
          }`}
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
          {/* table */}
          <ListSubheader>รายละเอียดคำสั่งซื้อ</ListSubheader>

          <Box display={"flex"}>
            {/* make all item flex */}
            <ListItem alignItems="flex-start">
              <ListItemText>
                สถานะคำสั่งซื้อ :&nbsp;
                {order.status === "complete" ? (
                  <Chip label="สำเร็จ" color="success" />
                ) : order.status === "waiting" ? (
                  <Chip label="รอจัดส่ง" color="warning" />
                ) : order.status === "pending" ? (
                  <Chip label="รอการตรวจสอบ" color="info" />
                ) : (
                  <Chip label="ยกเลิก" color="error" />
                )}
              </ListItemText>
              {order.status === "complete" ? (
                <ListItemText>เลขพัสดุ : {order.tracking_number}</ListItemText>
              ) : order.status === "pending" ? (
                <Chip
                  icon={<AddCircle />}
                  label="ตรวจสอบหลักฐาน"
                  color="info"
                  onClick={() => {
                    setShowTransaction(!showTransaction);
                  }}
                />
              ) : order.status === "waiting" ? (
                <Chip
                  icon={<AddCircle />}
                  label="ยืนยันการจัดส่ง"
                  color="info"
                  onClick={() => {
                    setShowTrackingNumber(!showTrackingNumber);
                  }}
                />
              ) : null}
            </ListItem>
            <Divider orientation="vertical" flexItem />
            <ListItem>
              <ListItemText primary={`วันที่สั่งซื้อ: ${order.date_buys}`} />
            </ListItem>
            <Divider orientation="vertical" flexItem />
            <ListItem>
              <ListItemText
                primary={`วันที่สำเร็จ: ${
                  order.date_complete ? order.date_complete : "ยังไม่สำเร็จ"
                }`}
              />
            </ListItem>
          </Box>
          {showTransaction && (
            <>
              <Divider />
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={`${config.getApiEndpoint(
                    `getimage/${order.transaction_confirm.split("/").pop()}`,
                    "get"
                  )}`}
                  alt="transaction"
                  style={{ height: "500px" }}
                />
              </ListItem>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginRight: "10px",
                }}
                onClick={() => {
                  let apiConfirmOrder = config.getApiEndpoint(
                    "confirmorder",
                    "POST"
                  );
                  axios
                    .post(
                      apiConfirmOrder,
                      {
                        order_id: order.order_id,
                        status: "waiting",
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${prop.jwt_token}`,
                        },
                      }
                    )
                    .then((res) => {
                      prop.fetchOrderHistory();
                      setShowTransaction(false);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                ยอมรับหลักฐานการจ่ายเงิน
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  showSweet();
                }}
              >
                ปฏิเสธ
              </Button>
            </>
          )}
          {showTrackingNumber && (
            <>
              <Divider />
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <TextField
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                  }}
                  size="small"
                  sx={{
                    marginRight: "10px",
                  }}
                  error={!regTrackingNumber}
                  label="เลขพัสดุ"
                  helperText={!regTrackingNumber ? "เลขพัสดุไม่ถูกต้อง" : ""}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const reg = /^[A-Za-z0-9]*$/;

                    if (!reg.test(trackingNumber)) {
                      setRegTrackingNumber(false);
                      return;
                    }
                    let apiConfirmOrder = config.getApiEndpoint(
                      "confirmorder",
                      "POST"
                    );

                    axios
                      .post(
                        apiConfirmOrder,
                        {
                          order_id: order.order_id,
                          status: "complete",
                          tracking_number: trackingNumber,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${prop.jwt_token}`,
                          },
                        }
                      )
                      .then((res) => {
                        prop.fetchOrderHistory();
                        setShowTrackingNumber(false);
                        Swal.fire({
                          title: "สำเร็จ",
                          text: "ยืนยันการจัดส่งสำเร็จ",
                          icon: "success",
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  sx={{}}
                >
                  ยืนยัน
                </Button>
              </ListItem>
            </>
          )}
          <Divider
            sx={{
              marginTop: "10px",
            }}
          />
          <ListSubheader>รายละเอียดผู้ซื้อ</ListSubheader>
          <Box display={"flex"}>
            <ListItem>
              <ListItemText>
                ชื่อ : {order.customer_info.firstname}{" "}
                {order.customer_info.lastname}
              </ListItemText>
              <ListItemText>
                เบอร์โทร : {order.customer_info.phone}
              </ListItemText>
            </ListItem>
            <Divider orientation="vertical" flexItem />
            <ListItem>
              <ListItemText>
                ที่อยู่ : {order.customer_info.address}
              </ListItemText>
            </ListItem>
          </Box>
          <Divider />

          <ListSubheader>สินค้าทั้งหมด</ListSubheader>
          <TableBank
            products={order.products}
            shippingcost={Number(order.shippingcost)}
          />
        </List>
      </Collapse>
    </>
  );
};

const Orderhistory = (prop: { jwt_token: string }) => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryInterface[]>([]);
  const [orderHistoryPage, setOrderHistoryPage] = useState<
    OrderHistoryInterface[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const fetchOrderHistory = () => {
    let apiOrderHistory = config.getApiEndpoint("farmerorder", "GET");
    axios
      .get(apiOrderHistory, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        const sortedOrders = res.data.sort(
          (a: OrderHistoryInterface, b: OrderHistoryInterface) => {
            return (
              new Date(b.date_buys).getTime() - new Date(a.date_buys).getTime()
            );
          }
        );

        setOrderHistory(sortedOrders);
        setTotalPage(Math.ceil(res.data.length / 10));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchOrderHistory();
  }, []);
  useEffect(() => {
    setOrderHistoryPage(orderHistory.slice((page - 1) * 10, page * 10));
  }, [page, orderHistory]);

  return (
    <>
      {orderHistory.length === 0 && (
        <Typography>ไม่มีประวัติการสั่งซื้อ</Typography>
      )}
      {orderHistoryPage.map((order, index) => {
        return (
          <EachOrder
            key={index}
            order={order}
            jwt_token={prop.jwt_token}
            fetchOrderHistory={fetchOrderHistory}
          />
        );
      })}
      {orderHistory.length > 0 && (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={totalPage}
            page={page}
            onChange={(e, value) => {
              setPage(value);
            }}
          />
        </Container>
      )}
    </>
  );
};

export default Orderhistory;
