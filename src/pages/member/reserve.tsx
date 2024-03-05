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
  const [provinces, setProvinces] = React.useState<province[]>([]);
  const [amphures, setAmphures] = React.useState<amphure[]>([]);
  const [tambons, setTambons] = React.useState<tambon[]>([]);

  React.useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      });
  }, []);

  const onChangeHandle = (province_id: string) => {
    let amphure = provinces.filter((province) => province.id == province_id)[0]
      .amphures;
    setAmphures(amphure);
  };

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
