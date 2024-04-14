import React, { useEffect, useState } from "react";
import { Container, Divider, Grid, Menu, Typography } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { th } from "date-fns/locale";
import type { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import axios from "axios";
import * as config from "../../config/config";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Card, CardContent, CardMedia, Stack, Button } from "@mui/material";
import { Chip } from "@mui/material";
import { CardActions } from "@mui/material";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { RGBColor } from "react-color";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { month } from "../../config/dataDropdown";
import MenuItem from "@mui/material/MenuItem";

interface Product {
  additional_image: string[];
  available: boolean;
  campaign_id: string;
  category_id: string;
  certificate: string[];
  date_reserve_end: string;
  date_reserve_start: string;
  farmer_id: string;
  farmerstorename: string;
  lastLogin: string;
  last_modified: string;
  price: number;
  product_description: string;
  product_id: string;
  product_image: string;
  product_name: string;
  product_video: string;
  selectedStatus: string;
  selectedType: string;
  stock: number;
  unit: string;
  view_count: number;
  weight: number;
  id: string;
}

interface Event {
  color: string;
  end: Date;
  start: Date;
  title: string;
}

const Editfestival = (prop: { jwt_token: string }) => {
  const apiCategories = config.getApiEndpoint("categories", "GET");
  const [events, setEvents] = React.useState<
    {
      event_id: number;
      title: string;
      start: Date;
      end: Date;
      editable?: boolean;
      admin_id: number | number[];
      color?: string;
      id: number;
    }[]
  >([]);
  const [showProduct, setShowProduct] = React.useState<Product[]>([]);
  const [allCategory, setAllCategory] = React.useState<
    {
      category_id: string;
      category_name: string;
      bgcolor: string;
    }[]
  >([]);
  const [selectedEvent, setSelectedEvent] = React.useState<Event>();
  const [filteredEvent, setFilteredEvent] = React.useState<Event[]>([]);

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    axios.get(config.getApiEndpoint("festival", "GET")).then((res) => {
      res.data.map((e: any) => {
        setEvents((prev) => [
          ...prev,
          {
            event_id: e.id,
            title: e.name,
            start: new Date(e.start_date),
            end: new Date(e.end_date),
            color: e.color ? e.color : "#50b500",
            admin_id: 1,
            id: e.id,
          },
        ]);
      });
      setFilteredEvent(
        res.data.map((e: any) => {
          return {
            title: e.name,
            start: new Date(e.start_date).toLocaleDateString("th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            end: new Date(e.end_date).toLocaleDateString("th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            id: e.id,
          };
        })
      );
    });
    axios.get(apiCategories).then((res) => {
      setAllCategory([
        {
          category_id: "",
          category_name: "ทั้งหมด",
          bgcolor: "",
        },
        ...res.data,
      ]);
    });
  }, []);

  const handleClick = (event: ProcessedEvent) => {
    setSelectedEvent({
      color: event.color ? event.color : "#50b500",
      end: event.end,
      start: event.start,
      title: event.title,
    });
    axios
      .get(config.getApiEndpoint(`festival/${event.event_id}`, "GET"))
      .then((res) => {
        setShowProduct(res.data);
      });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 2,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Scheduler
            events={events}
            view="month"
            locale={th}
            week={null}
            editable={false}
            deletable={false}
            onEventClick={handleClick}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="เดือน"
            value={month[new Date().getMonth()]}
            fullWidth
          >
            {month.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField select label="ปี" fullWidth>
            <MenuItem></MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={filteredEvent}
            columns={[
              { field: "title", headerName: "ชื่อเทศกาล", flex: 1 },
              { field: "start", headerName: "วันเริ่มต้น", flex: 1 },
              { field: "end", headerName: "วันสิ้นสุด", flex: 1 },
            ]}
          />
        </Grid>
        {selectedEvent && (
          <>
            <Grid item xs={12}>
              <Typography variant="h2">{selectedEvent?.title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                {selectedEvent?.start.toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {selectedEvent?.end.toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Grid>
          </>
        )}
        {/* {showProduct.map((product, index) => {
          let date = new Date(product.last_modified).toLocaleDateString();
          let bgcolor = allCategory.find(
            (item) => item.category_id === product.category_id
          )?.bgcolor
            ? JSON.parse(
                allCategory.find(
                  (item) => item.category_id === product.category_id
                )?.bgcolor as string
              )
            : ({ r: 68, g: 93, b: 72, a: 1 } as {
                r: number;
                g: number;
                b: number;
                a: number;
              });
          let nameCategory = allCategory.find(
            (item) => item.category_id === product.category_id
          )?.category_name
            ? allCategory.find(
                (item) => item.category_id === product.category_id
              )?.category_name
            : "OTHER";
          return (
            <Grid item key={index} lg={4} xs={12} sm={6} padding={1}>
              <NavLink
                to={`/shop/${product.farmerstorename}/${product.product_id}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "10px",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={
                      product.product_image
                        ? `${config.getApiEndpoint(
                            `getimage/${product.product_image
                              .split("/")
                              .pop()}`,
                            "get"
                          )}`
                        : require("../../assets/noimage.jpg")
                    }
                  />
                  <CardContent sx={{ flexGrow: 1, padding: "20px" }}>
                    <Stack direction="row" spacing={1}>
                      {product.selectedType !== "ประชาสัมพันธ์" && (
                        <Stack>
                          <Button
                            sx={{
                              alignRight: "right",
                            }}
                          >
                            <ShoppingCartIcon />
                          </Button>
                        </Stack>
                      )}
                      <Stack>
                        <Typography gutterBottom variant="h5">
                          {product.product_name}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Chip
                      label={product.selectedType}
                      sx={{
                        marginRight: "5px",
                        marginBottom: "10px",
                      }}
                    />
                    <Chip
                      label={nameCategory}
                      sx={{
                        backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                        color: isDark(bgcolor) ? "white" : "black",
                        marginRight: "5px",
                        marginBottom: "10px",
                      }}
                    />
                    <Typography
                      sx={{
                        marginTop: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 4, // จำนวนบรรทัดที่ต้องการแสดง
                      }}
                    >
                      {product.product_description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ padding: "20px" }}>
                    {product.selectedType != "จองสินค้าผ่านเว็บไซต์" && (
                      <Typography
                        sx={{
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        {product.price} บาท
                      </Typography>
                    )}

                    <Typography
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {product.farmerstorename}
                    </Typography>
                  </CardActions>
                </Card>
              </NavLink>
            </Grid>
          );
        })} 
        {showProduct.length === 0 && selectedEvent && (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                marginTop: 2,
                marginBottom: 2,
                color: "gray",
              }}
              align="center"
            >
              ไม่มีข้อมูลสินค้าในเทศกาลนี้
            </Typography>
          </Grid>
        )}*/}
        <Grid
          item
          xs={12}
          sx={{
            marginTop: 2,
          }}
        >
          <Typography variant="h4">สินค้าจัดส่งพัสดุ</Typography>
          <DataGrid
            rows={showProduct.filter(
              (item) => item.selectedType === "สินค้าจัดส่งพัสดุ"
            )}
            columns={[
              { field: "farmerstorename", headerName: "ร้านค้า", flex: 1 },
              { field: "product_name", headerName: "ชื่อสินค้า", flex: 1 },
              { field: "stock", headerName: "จำนวนคลัง", flex: 1 },
              { field: "price", headerName: "ราคา/หน่วย", flex: 1 },
              { field: "unit", headerName: "หน่วย", flex: 1 },
              {
                field: "action",
                headerName: "สถานะ",
                flex: 1,

                renderCell: (params) => (
                  <>
                    <Chip
                      label="เข้าร่วม"
                      color="primary"
                      onClick={() => {
                        axios.post(
                          config.getApiEndpoint(
                            `campaign/${params.row.campaign_id}/${params.row.product_id}`,
                            "POST"
                          ),
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        );
                      }}
                    />
                    <Chip
                      label="ไม่เข้าร่วม"
                      color="error"
                      onClick={() => {
                        axios.delete(
                          config.getApiEndpoint(
                            `campaign/${params.row.campaign_id}/${params.row.product_id}`,
                            "DELETE"
                          ),
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        );
                      }}
                    />
                  </>
                ),
              },
            ]}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: 6,
          }}
        >
          <Typography variant="h4">สินค้าจองสินค้าผ่านเว็บไซต์</Typography>
          <DataGrid
            rows={showProduct.filter(
              (item) => item.selectedType === "จองสินค้าผ่านเว็บไซต์"
            )}
            columns={[
              { field: "product_name", headerName: "ชื่อสินค้า", flex: 1 },
              { field: "selectedType", headerName: "ประเภท", flex: 1 },
              { field: "farmerstorename", headerName: "ร้านค้า", flex: 1 },
              {
                field: "action",
                headerName: "สถานะ",
                flex: 1,

                renderCell: (params) => (
                  <>
                    <Chip
                      label="เข้าร่วม"
                      color="primary"
                      onClick={() => {
                        axios.post(
                          config.getApiEndpoint(
                            `campaign/${params.row.campaign_id}/${params.row.product_id}`,
                            "POST"
                          ),
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        );
                      }}
                    />
                    <Chip
                      label="ไม่เข้าร่วม"
                      color="error"
                      onClick={() => {
                        axios.delete(
                          config.getApiEndpoint(
                            `campaign/${params.row.campaign_id}/${params.row.product_id}`,
                            "DELETE"
                          ),
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        );
                      }}
                    />
                  </>
                ),
              },
            ]}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: 6,
          }}
        >
          <Typography variant="h4">สินค้าประชาสัมพันธ์</Typography>
          <DataGrid
            rows={showProduct.filter(
              (item) => item.selectedType === "ประชาสัมพันธ์"
            )}
            columns={[
              { field: "product_name", headerName: "ชื่อสินค้า", flex: 1 },
              { field: "selectedType", headerName: "ประเภท", flex: 1 },
              { field: "price", headerName: "ราคา", flex: 1 },
              { field: "farmerstorename", headerName: "ร้านค้า", flex: 1 },
              {
                field: "action",
                headerName: "สถานะ",
                flex: 1,

                renderCell: (params) => (
                  <>
                    <Chip
                      label="เข้าร่วม"
                      color="primary"
                      onClick={() => {
                        axios.post(
                          config.getApiEndpoint(
                            `campaign/${params.row.campaign_id}/${params.row.product_id}`,
                            "POST"
                          ),
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        );
                      }}
                    />
                    <Chip
                      label="ไม่เข้าร่วม"
                      color="error"
                      onClick={() => {
                        axios.patch(
                          config.getApiEndpoint(
                            `campaign/${params.row.campaign_id}/${params.row.product_id}`,
                            "PATCH"
                          ),
                          {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                          }
                        );
                      }}
                    />
                  </>
                ),
              },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Editfestival;
