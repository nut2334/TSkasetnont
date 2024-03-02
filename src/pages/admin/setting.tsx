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
  const [bgColor, setBgColor] = useState<RGBColor>({
    r: 235,
    g: 235,
    b: 235,
    a: 1,
  });
  const [standard, setStandard] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);
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
  useEffect(() => {
    const apiStandard = config.getApiEndpoint("standardproducts", "GET");
    axios.get(apiStandard).then((res) => {
      setStandard(res.data);
    });
  }, []);

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };
  const handleEdit = (id: string, bgColor: RGBColor) => {
    setId(id);
    setName(
      category.filter((cat) => {
        return cat.category_id === id;
      })[0].category_name
    );
    setBgColor(bgColor);
  };

  const handleSubmit = (isNewEdit: Boolean, paramName?: string) => {
    let body = {
      category_name: paramName ? paramName : name,
    } as { category_name: string; bgcolor: string; category_id?: string };

    if (!isNewEdit) {
      body = {
        ...body,
        category_id: id,
        bgcolor: JSON.stringify(bgColor),
      };
    } else {
      body = {
        ...body,
        bgcolor: JSON.stringify({ r: 235, g: 235, b: 235, a: 1 }),
      };
    }

    axios
      .post(config.getApiEndpoint("categories", "POST"), body, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        axios.get(config.getApiEndpoint("categories", "GET")).then((res) => {
          setCategory(res.data);
          Swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
          });
        });
      })
      .catch((err) => {
        Swal.fire({
          title: `เกิดข้อผิดพลาด ${err.response.data.message}`,
          icon: "error",
        });
        console.log(err);
      });
  };

  const showSwal = () => {
    withReactContent(Swal).fire({
      title: <i>เพิ่มหมวดหมู่สินค้า</i>,
      input: "text",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "บันทึก",
      preConfirm: () => {
        // setId(Swal.getInput()?.value || "");

        handleSubmit(true, Swal.getInput()?.value || "");
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
              : ({ r: 235, g: 235, b: 235, a: 1 } as RGBColor);
            if (cat.category_id !== "OTHER") {
              return (
                <Chip
                  key={cat.category_id}
                  label={cat.category_name}
                  onDelete={() => {
                    handleEdit(cat.category_id, bgcolor);
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

              <Button
                variant="contained"
                sx={{
                  marginRight: "10px",
                }}
                onClick={() => handleSubmit(false)}
              >
                บันทึก
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  axios
                    .delete(config.getApiEndpoint("categories", "DELETE"), {
                      headers: {
                        Authorization: `Bearer ${prop.jwt_token}`,
                      },
                      data: {
                        category_id: id,
                      },
                    })
                    .then((res) => {
                      axios
                        .get(config.getApiEndpoint("categories", "GET"))
                        .then((res) => {
                          Swal.fire({
                            title: "ลบสำเร็จ",
                            icon: "success",
                          });
                          setId("");
                          setCategory(res.data);
                        })
                        .catch((err) => {
                          Swal.fire({
                            title: "เกิดข้อผิดพลาด",
                            icon: "error",
                          });
                          console.log(err);
                        });
                    });
                }}
              >
                ลบ
              </Button>
            </Box>
          </>
        )}
      </Grid>
      <Grid item xs={12} marginBottom={2}>
        <Divider>
          <Typography>มาตรฐานสินค้า</Typography>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        {standard.map((std) => {
          return (
            <Chip
              key={std.standard_id}
              label={std.standard_name}
              sx={{ margin: "5px" }}
            />
          );
        })}
      </Grid>
    </Container>
  );
};

export default SettingAdmin;
