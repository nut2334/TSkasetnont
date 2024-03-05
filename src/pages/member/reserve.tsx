import React from "react";
import { useParams } from "react-router-dom";
import { Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Container } from "@mui/material";

interface province {
  id: string;
  name_th: string;
  amphures: amphure[];
}

interface amphure {
  id: string;
  name_th: string;
  tambon: tambon[];
}

interface tambon {
  id: string;
  name_th: string;
}

const Reserve = () => {
  const { productid } = useParams<{ productid: string }>();

  return (
    <>
      <Container component="main" maxWidth="xs" sx={{ marginTop: 3 }}>
        จองสินค้า
        <Typography>{productid}</Typography>
        <Typography>จำนวน</Typography>
        <Typography>ค่ามัดจำ</Typography>
        <TextField label="Line Id" fullWidth />
        <TextField label="เบอร์โทร" fullWidth />
      </Container>
    </>
  );
};

export default Reserve;
