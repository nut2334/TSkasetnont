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
        ซื้อสินค้า
        <Grid item xs={12}>
          <TextField
            multiline
            label="ที่อยู่ปัจจุบัน"
            fullWidth
            rows={4}
            disabled
          />
        </Grid>
        <Divider>เปลี่ยนที่จัดส่ง</Divider>
        <Grid item xs={12}>
          <TextField
            select
            label="จังหวัด"
            fullWidth
            onChange={(e) => onChangeHandle(e.target.value)}
          >
            {provinces.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name_th}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField select label="อำเภอ" fullWidth>
            {amphures.map((amphure) => (
              <MenuItem key={amphure.id} value={amphure.id}>
                {amphure.name_th}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField select label="ตำบล" fullWidth>
            {tambons.map((tambon) => (
              <MenuItem key={tambon.id} value={tambon.id}>
                {tambon.name_th}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField label="รหัสไปรษณีย์" fullWidth disabled />
        </Grid>
        <Grid item xs={12}>
          <TextField multiline label="ที่อยู่" fullWidth rows={4} />
        </Grid>
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
