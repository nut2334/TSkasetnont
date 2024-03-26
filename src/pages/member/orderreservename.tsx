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
  Pagination,
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
  farmer_info: {
    farmer_id: string;
    farmerstorename: string;
    phone: string;
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
          <ListSubheader>รายละเอียดผู้ขาย</ListSubheader>
          <Box display={"flex"}>
            <ListItem>
              <ListItemText>
                ร้านค้า : {order.farmer_info.farmerstorename}
              </ListItemText>
            </ListItem>

            <Divider orientation="vertical" flexItem />
            <ListItem>
              <ListItemText>เบอร์โทร : {order.farmer_info.phone}</ListItemText>
            </ListItem>
            <Divider orientation="vertical" flexItem />
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
            </ListItem>
            <Divider orientation="vertical" flexItem />
          </Box>
        </List>
      </Collapse>
    </>
  );
};
const Orderreservemember = (prop: { jwt_token: string }) => {
  const [orderReserve, setOrderReserve] = React.useState<
    OrderReserveInterface[]
  >([]);
  const [filterOrderReserve, setFilterOrderReserve] = React.useState<
    OrderReserveInterface[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    setFilterOrderReserve(orderReserve.slice((page - 1) * 10, page * 10));
  }, [page, orderReserve]);

  const fetchOrderHistory = () => {
    axios
      .get(config.getApiEndpoint("memberreserve", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setOrderReserve(response.data.data);
        setTotalPage(Math.ceil(response.data.data.length / 10));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container maxWidth="lg">
      {orderReserve.length === 0 && <Typography>ไม่มีประวัติการจอง</Typography>}
      {filterOrderReserve.map((order, index) => {
        return (
          <EachReserve
            key={index}
            order={order}
            jwt_token={prop.jwt_token}
            fetchOrderHistory={fetchOrderHistory}
          />
        );
      })}
      {orderReserve.length > 0 && (
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
    </Container>
  );
};

export default Orderreservemember;
