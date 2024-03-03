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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { Box, Button, Chip, Container, ListItem, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import AddCircle from "@mui/icons-material/AddCircle";
import TableBank from "../../components/tablebank";

interface orderInterface {
  id: string;
  status: string;
  total_amount: number;
  date_buys: string;
  tracking_number: string;
  date_complete: string | null;
  transaction_comfirm: string | null;
  comment: string | null;
  products: {
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
  }[];
}
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

const EachOrder = (prop: {
  order: orderInterface;
  jwt_token: string;
  fecthOrder: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const { order } = prop;
  const handleClick = () => {
    setOpen(!open);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 2,
        }}
      >
        <ListItemButton
          onClick={handleClick}
          sx={{
            backgroundColor:
              order.status === "complete"
                ? "#D1F2EB"
                : order.status === "waiting"
                ? "#FDEBD0"
                : order.status === "pending"
                ? "#D6EAF8"
                : "#FADBD8",
            borderRadius: 2,
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
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* table */}
            <ListSubheader>รายละเอียดคำสั่งซื้อ</ListSubheader>

            <Box display={"flex"}>
              {/* make all item flex */}
              <ListItem alignItems="flex-start">
                <ListItemText>
                  สถาณะคำสั่งซื้อ :&nbsp;
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

                {order.status === "reject" ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files === null) {
                          return;
                        }
                        let files = e.target.files[0];
                        let apiImageUpload = config.getApiEndpoint(
                          "confirmtrancsaction",
                          "POST"
                        );
                        const data = new FormData();
                        data.append("productSlip", files);
                        data.append("order_id", order.id);

                        axios
                          .post(apiImageUpload, data, {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          })
                          .then(() => {
                            prop.fecthOrder();
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    />

                    <Chip
                      icon={<AddCircle />}
                      label="แจ้งชำระเงิน"
                      color="info"
                      onClick={() => {
                        inputRef.current?.click();
                      }}
                    />

                    <Chip label={order.comment} />
                  </>
                ) : order.status == "complete" ? (
                  <ListItemText
                    primary={`เลขพัสดุ: ${order.tracking_number}`}
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

            <Divider />

            <ListSubheader>สินค้าทั้งหมด</ListSubheader>
            <TableBank
              products={order.products}
              haveComment={
                order.status == "complete"
                  ? {
                      fecthOrder: prop.fecthOrder,
                      jwt_token: prop.jwt_token,
                      order_id: order.id,
                    }
                  : undefined
              }
            />
          </List>
        </Collapse>
      </Container>
    </>
  );
};

const Orderlist = (prop: { jwt_token: string }) => {
  const [orderList, setOrderList] = useState<orderInterface[]>([]);
  const fecthOrder = () => {
    let apiOrderList = config.getApiEndpoint("orderlist", "GET");
    axios
      .get(apiOrderList, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        const sortedOrders = res.data.orders.sort(
          (a: orderInterface, b: orderInterface) => {
            return (
              new Date(b.date_buys).getTime() - new Date(a.date_buys).getTime()
            );
          }
        );
        console.log(sortedOrders);
        setOrderList(sortedOrders);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fecthOrder();
  }, []);

  return (
    <div>
      {orderList.map((order: any, index: number) => {
        return (
          <EachOrder
            key={index}
            order={order}
            jwt_token={prop.jwt_token}
            fecthOrder={fecthOrder}
          />
        );
      })}
    </div>
  );
};

export default Orderlist;
