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
import * as config from "../../config/config";
import { Box, Chip, Typography } from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";
import { Container } from "@mui/system";

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

interface requestInterface {
  id: string;
  standard_name: string;
  firstname: string;
  lastname: string;
  image_path: string;
  certificate_number: string;
  name?: string;
}
const EachRow = (prop: {
  row: requestInterface;
  jwt_token: string;
  setAllRequest: React.Dispatch<React.SetStateAction<requestInterface[]>>;
}) => {
  const [open, setOpen] = useState(false);
  const handleClick = (isAccept: boolean, id: string) => {
    let apiCert = config.getApiEndpoint("certificate", "patch");
    if (isAccept) {
      axios
        .patch(
          apiCert,
          { id: id, status: "complete" },
          {
            headers: {
              Authorization: `Bearer ${prop.jwt_token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            title: "สำเร็จ",
            text: "ยอมรับการขอใบรับรอง",
            icon: "success",
            confirmButtonText: "Cool",
          });
          axios
            .get(config.getApiEndpoint("getadmincertificate", "GET"), {
              headers: {
                Authorization: `Bearer ${prop.jwt_token}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              let temp: requestInterface[] = response.data.certificate;
              prop.setAllRequest(temp);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //บอกเหตุผล
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการปฏิเสธการขอใบรับรองนี้",
        icon: "warning",
        input: "text",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่",
      }).then((result) => {
        if (result.isConfirmed) {
          if (result.value) {
            axios
              .patch(
                apiCert,
                { id: id, status: "reject", comment: result.value },
                {
                  headers: {
                    Authorization: `Bearer ${prop.jwt_token}`,
                  },
                }
              )
              .then((response) => {
                console.log(response.data);
                Swal.fire({
                  title: "สำเร็จ",
                  text: "ปฏิเสธการขอใบรับรอง",
                  icon: "success",
                  confirmButtonText: "Cool",
                });
                axios
                  .get(config.getApiEndpoint("getadmincertificate", "GET"), {
                    headers: {
                      Authorization: `Bearer ${prop.jwt_token}`,
                    },
                  })
                  .then((response) => {
                    let temp: requestInterface[] = response.data.certificate;
                    prop.setAllRequest(temp);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            Swal.fire({
              title: "ผิดพลาด",
              text: "กรุณากรอกเหตุผล",
              icon: "error",
              confirmButtonText: "Cool",
            });
          }
        }
      });
    }
  };
  return (
    <>
      <StyledTableRow key={prop.row.id}>
        <StyledTableCell component="th" scope="row">
          {`${
            prop.row.standard_name == "อื่นๆ"
              ? `(${prop.row.standard_name}) ${prop.row.name}`
              : prop.row.standard_name
          }`}
        </StyledTableCell>
        <StyledTableCell>
          {prop.row.firstname} {prop.row.lastname}
        </StyledTableCell>

        <StyledTableCell align="right">
          <Chip
            label="ยอมรับ"
            color="success"
            onClick={() => {
              handleClick(true, prop.row.id);
            }}
          />
          <Chip
            label="ปฏิเสธ"
            color="error"
            onClick={() => {
              handleClick(false, prop.row.id);
            }}
          />
        </StyledTableCell>
      </StyledTableRow>
      {open && (
        <StyledTableRow>
          <StyledTableCell colSpan={5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={`${config.getApiEndpoint(
                  `getimage/${prop.row.image_path.split("/").pop()}`,
                  "get"
                )}`}
                style={{ width: "50%", height: "50%" }}
              />
            </Box>
          </StyledTableCell>
        </StyledTableRow>
      )}
    </>
  );
};

const Certification = (prop: { jwt_token: string }) => {
  const [allRequest, setAllRequest] = useState<requestInterface[]>([]);
  useEffect(() => {
    axios
      .get(config.getApiEndpoint("getadmincertificate", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        let temp: requestInterface[] = response.data.certificate;
        setAllRequest(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        sx={{
          marginTop: 5,
          marginBottom: 2,
        }}
      >
        เกษตรกรขอเพิ่มมาตรฐาน
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>ประเภทมาตรฐาน</StyledTableCell>
              <StyledTableCell>ผู้ขอ</StyledTableCell>
              <StyledTableCell align="right">การกระทำ</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          {allRequest.length == 0 && (
            <TableBody>
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  ไม่มีข้อมูล
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          )}
          <TableBody>
            {allRequest.map((row) => (
              <EachRow
                row={row}
                jwt_token={prop.jwt_token}
                setAllRequest={setAllRequest}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Certification;
