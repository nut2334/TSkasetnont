import React, { useState, useEffect, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import axios from "axios";
import * as config from "../config/config";
import { Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Rating } from "@mui/material";

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
interface productInterface {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  comment?: {
    rating: number;
    date_comment: string;
    comment: string;
    review_id?: string;
  };
}

const GenerateStart = (prop: {
  index2: number;
  product: productInterface;
  haveComment: {
    jwt_token: string;
    order_id: string;
    fecthOrder: () => void;
  };
  callSwl: (
    rating: number,
    product_id: string,
    order_id: string,
    jwt_token: string,
    review_id?: string
  ) => void;
}) => {
  const { haveComment, product, callSwl } = prop;
  const [toggleEdit, setToggleEdit] = useState(false);

  return (
    <StyledTableCell
      align="right"
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Rating
        value={product.comment?.rating}
        readOnly={product.comment && !toggleEdit ? true : false}
        onChange={(_, rating) => {
          if (rating) {
            callSwl(
              rating,
              product.product_id,
              haveComment.order_id,
              haveComment.jwt_token,
              product.comment?.review_id
            );
            if (toggleEdit) {
              setToggleEdit(!toggleEdit);
            }
          }
        }}
      />
      {product.comment && (
        <Chip
          label={"แก้ไข"}
          icon={<EditIcon color={toggleEdit ? "error" : "inherit"} />}
          onClick={() => {
            setToggleEdit(!toggleEdit);
          }}
        />
      )}
    </StyledTableCell>
  );
};

const TableBank = (prop: {
  products: productInterface[];
  shippingcost?: number;
  haveComment?: {
    jwt_token: string;
    order_id: string;
    fecthOrder: () => void;
  };
}) => {
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    let total = 0;
    prop.products.forEach((product) => {
      total += product.price * product.quantity;
    });
    setTotal(total);
  }, [prop.products]);

  const callSwl = (
    rating: number,
    product_id: string,
    order_id: string,
    jwt_token: string,
    review_id?: string
  ) => {
    Swal.fire({
      title: "ความคิดเห็น",
      input: "textarea",
      showCancelButton: true,
      inputPlaceholder: "กรุณาใส่ความคิดเห็น(ถ้ามี)",
    }).then((result) => {
      if (result.isDismissed) {
        return;
      }
      let apiComment = config.getApiEndpoint(
        `${review_id ? `editcomment/${review_id}` : `comment`}`,
        "GET"
      );
      let body = {
        product_id: product_id,
        order_id: order_id,
        rating: rating,
        comment: result.value ? result.value : "",
      };
      axios
        .post(apiComment, body, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        })
        .then((res) => {
          console.log(res);
          Swal.fire({
            icon: "success",
            title: `${
              review_id ? "เพิ่มความคิดเห็นสำเร็จ" : "แก้ไขความคิดเห็นสำเร็จ"
            }`,
            showConfirmButton: false,
            timer: 1500,
          });
          prop.haveComment?.fecthOrder();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "เพิ่มความคิดเห็นไม่สำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    });
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>สินค้า</StyledTableCell>
            <StyledTableCell>รายการ</StyledTableCell>
            <StyledTableCell align="right">จำนวน</StyledTableCell>
            <StyledTableCell align="right">ราคา</StyledTableCell>
            {prop.haveComment && (
              <StyledTableCell align="right">ความคิดเห็น</StyledTableCell>
            )}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {prop.products.map((product, index2) => (
            <StyledTableRow key={index2}>
              <StyledTableCell align="left">{index2 + 1}</StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {product.product_name}
              </StyledTableCell>
              <StyledTableCell align="right">
                {product.quantity}
              </StyledTableCell>
              <StyledTableCell align="right">
                {product.price * product.quantity} บาท
              </StyledTableCell>

              {prop.haveComment && (
                <>
                  <GenerateStart
                    callSwl={callSwl}
                    haveComment={prop.haveComment}
                    product={product}
                    index2={index2}
                  />
                </>
              )}
            </StyledTableRow>
          ))}
          {/* total */}
          <StyledTableRow>
            <StyledTableCell colSpan={prop.haveComment ? 5 : 4} align="right">
              <Box>ราคารวม : {total} บาท</Box>
              {prop.shippingcost ? (
                <Box>รวมราคาค่าจัดส่ง : {total + prop.shippingcost} บาท</Box>
              ) : null}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableBank;
