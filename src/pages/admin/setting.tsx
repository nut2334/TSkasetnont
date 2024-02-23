import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import {
  Container,
  Divider,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import * as config from "../../config/config";
import CreateIcon from "@mui/icons-material/Create";
import Hue from "@uiw/react-color-hue";
import { CirclePicker } from "react-color";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

const SettingAdmin = () => {
  const [category, setCategory] = React.useState<
    {
      category_id: string;
      category_name: string;
      textcolor: string;
      bgcolor: string;
    }[]
  >([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("");

  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  useEffect(() => {
    axios.get(config.getApiEndpoint("categories", "GET")).then((res) => {
      setCategory(res.data);
    });
  }, []);
  const handleEdit = (id: string) => {
    console.log(id);
    setId(id);
    setName(
      category.filter((cat) => {
        return cat.category_id === id;
      })[0].category_name
    );
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: "20px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            การตั้งค่า
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider>
            <Typography>หมวดหมู่สินค้า</Typography>
          </Divider>
        </Grid>
        <Grid item xs={12}>
          {category.map((cat) => {
            if (cat.category_id !== "OTHER") {
              return (
                <Chip
                  key={cat.category_id}
                  label={cat.category_name}
                  onDelete={() => {
                    handleEdit(cat.category_id);
                  }}
                  deleteIcon={<CreateIcon />}
                  sx={{
                    margin: "5px",
                    backgroundColor: cat.bgcolor,
                    color: cat.textcolor,
                  }}
                />
              );
            } else {
              return (
                <Chip
                  key={cat.category_id}
                  label={cat.category_name}
                  sx={{ margin: "5px" }}
                />
              );
            }
          })}
        </Grid>
        <Grid item xs={12}>
          <Divider>
            <Typography>แก้ไขหมวดหมู่สินค้า</Typography>
          </Divider>
        </Grid>
        {id && (
          <>
            <Box>
              <Chip
                label={name}
                sx={{
                  margin: "5px",
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: "20px",
                }}
              />

              <TextField
                value={name}
                id="outlined-basic"
                label="ชื่อหมวดหมู่"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

              <Typography>สีตัวอักษร</Typography>
              <CirclePicker
                color={textColor}
                onChange={(color) => {
                  setTextColor(color.hex);
                }}
              />

              <Typography>สีพื้นหลัง</Typography>
              <Hue
                hue={hsva.h}
                onChange={(newHue) => {
                  setHsva({ ...hsva, ...newHue });
                }}
              />

              <Button variant="contained">บันทึก</Button>
            </Box>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default SettingAdmin;
