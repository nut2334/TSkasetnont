import React, { useEffect } from "react";
import Chip from "@mui/material/Chip";
import { Container, Divider, Grid, Typography } from "@mui/material";
import axios from "axios";
import * as config from "../../config/config";
import CreateIcon from "@mui/icons-material/Create";
import { CirclePicker } from "react-color";

const SettingAdmin = () => {
  const [category, setCategory] = React.useState<
    {
      category_id: string;
      category_name: string;
      color: string;
    }[]
  >([]);
  const [editCategory, setEditCategory] = React.useState<
    {
      category_id: string;
      category_name: string;
      color: string;
    }[]
  >([]);
  useEffect(() => {
    axios.get(config.getApiEndpoint("categories", "GET")).then((res) => {
      setCategory(res.data);
    });
  }, []);
  const handleEdit = () => {
    console.log(category);
    setEditCategory(category);
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
                  onDelete={handleEdit}
                  deleteIcon={<CreateIcon />}
                  sx={{ margin: "5px", backgroundColor: cat.color }}
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
        <CirclePicker />
      </Grid>
    </Container>
  );
};

export default SettingAdmin;
