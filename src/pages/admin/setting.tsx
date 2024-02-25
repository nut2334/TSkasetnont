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
import AddIcon from "@mui/icons-material/Add";
import { BlockPicker, RGBColor } from "react-color";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SettingAdmin = (prop: { jwt_token: string }) => {
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
  const [bgColor, setBgColor] = useState<RGBColor>({ r: 0, g: 0, b: 0, a: 1 });
  useEffect(() => {
    axios.get(config.getApiEndpoint("categories", "GET")).then((res) => {
      setCategory(res.data);
    });
  }, []);
  useEffect(() => {
    if (isDark(bgColor)) {
      setTextColor("white");
    } else {
      setTextColor("black");
    }
  }, [bgColor]);

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };
  const handleEdit = (id: string) => {
    setId(id);
    setName(
      category.filter((cat) => {
        return cat.category_id === id;
      })[0].category_name
    );
  };

  const handleSubmit = () => {
    let body = {
      category_name: name,
      bgcolor: JSON.stringify(bgColor),
    };

    axios
      .post(config.getApiEndpoint("categories", "POST"), body, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        console.log(res);
        axios.get(config.getApiEndpoint("categories", "GET")).then((res) => {
          setCategory(res.data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showSwal = () => {
    console.log("1");

    withReactContent(Swal).fire({
      title: <i>เพิ่มหมวดหมู่สินค้า</i>,
      input: "text",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "บันทึก",
      preConfirm: () => {
        // setId(Swal.getInput()?.value || "");
        setName(Swal.getInput()?.value || "");
        handleSubmit();
      },
    });
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
            let bgcolor = cat.bgcolor
              ? JSON.parse(cat.bgcolor)
              : ({ r: 235, g: 235, b: 235, a: 1 } as {
                  r: number;
                  g: number;
                  b: number;
                  a: number;
                });
            if (cat.category_id !== "OTHER") {
              return (
                <Chip
                  key={cat.category_id}
                  label={cat.category_name}
                  onDelete={() => {
                    handleEdit(cat.category_id);
                  }}
                  deleteIcon={
                    <CreateIcon
                      sx={{ fill: isDark(bgcolor) ? "white" : "black" }}
                    />
                  }
                  sx={{
                    margin: "5px",
                    backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                    color: isDark(bgcolor) ? "white" : "black",
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
          <Chip
            label={<AddIcon sx={{ paddingTop: "5px" }} />}
            onClick={showSwal}
            sx={{ margin: "5px", position: "relative" }}
          />
        </Grid>

        {id && (
          <>
            <Grid item xs={12} marginBottom={2}>
              <Divider>
                <Typography>แก้ไขหมวดหมู่สินค้า</Typography>
              </Divider>
            </Grid>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "100px",
                marginRight: "50px",
              }}
            >
              <Chip
                label={name}
                sx={{
                  marginBottom: "10px",
                  backgroundColor: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
                  color: textColor,
                  fontSize: "20px",
                }}
              />
              <BlockPicker
                color={bgColor}
                onChange={(color) => {
                  setBgColor(color.rgb);
                }}
              />
            </Box>
            <Box>
              <TextField
                value={name}
                id="outlined-basic"
                label="ชื่อหมวดหมู่"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setName(e.target.value);
                }}
                sx={{ marginBottom: "10px" }}
              />

              <Button variant="contained" onClick={handleSubmit}>
                บันทึก
              </Button>
            </Box>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default SettingAdmin;
