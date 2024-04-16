import React, { useEffect, useState } from "react";
import { Container, Divider, Grid, Menu, Typography } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { th } from "date-fns/locale";
import axios from "axios";
import * as config from "../../config/config";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Chip } from "@mui/material";
import { RGBColor } from "react-color";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { month } from "../../config/dataDropdown";
import MenuItem from "@mui/material/MenuItem";
import { Event } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { event_status } from "../../config/dataDropdown";
import { NavLink, Navigate } from "react-router-dom";

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
  is_accept: string;
  name: string;
  festivalId: string;
}

interface FestivalDetail {
  id: string;
  title: string;
  is_accept: string;
  date_start: Date;
  date_end: Date;
  products: Product[];
}

interface Event {
  color?: string;
  end: Date;
  start: Date;
  title: string;
}

const Festival = (prop: { jwt_token: string }) => {
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
  const [allEvent, setAllEvent] = React.useState<Event[]>([]);
  const [searchMonth, setSearchMonth] = React.useState<string>("");
  const [searchYear, setSearchYear] = React.useState<string>("");
  const [myEvent, setMyEvent] = React.useState<FestivalDetail[]>([]);

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
      setEvents(
        res.data.map((e: any) => {
          return {
            event_id: e.id,
            title: e.name,
            start: new Date(e.start_date),
            end: new Date(e.end_date),
            color: e.color ? e.color : "#50b500",
            admin_id: 1,
            id: e.id,
          };
        })
      );
      setFilteredEvent(
        res.data.map((e: any) => {
          return {
            title: e.name,
            start: new Date(e.start_date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            end: new Date(e.end_date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            id: e.id,
          };
        })
      );
      setAllEvent(
        res.data.map((e: any) => {
          return {
            title: e.name,
            start: new Date(e.start_date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            end: new Date(e.end_date).toLocaleDateString("th-TH", {
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

  useEffect(() => {
    prop.jwt_token &&
      axios
        .get(config.getApiEndpoint("festivaldetail", "GET"), {
          headers: {
            Authorization: `Bearer ${prop.jwt_token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setMyEvent(res.data.festivals);
        })
        .catch((err) => {
          console.error(err);
        });
  }, [prop.jwt_token]);

  useEffect(() => {
    let filtered = allEvent;
    if (searchYear !== "" && searchYear !== "all") {
      filtered = filtered.filter((event) => {
        let yearStart = `${event.start}`.split(" ")[2];
        let yearEnd = `${event.end}`.split(" ")[2];
        return yearStart == searchYear + 543 || yearEnd == searchYear + 543;
      });
    }
    if (searchMonth !== "" && searchMonth !== "all") {
      filtered = filtered.filter((event) => {
        let monthStart = `${event.start}`.split(" ")[1];
        let monthEnd = `${event.end}`.split(" ")[1];
        return monthStart === searchMonth || monthEnd === searchMonth;
      });
    }
    setFilteredEvent(filtered);
  }, [searchMonth, searchYear]);

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
        setShowProduct(
          res.data.map((product: any) => {
            return {
              ...product,
              is_accept: event_status.find(
                (item) => item.statusID === product.is_accept
              )?.statusName,
            };
          })
        );
        console.log(res.data);
      });
  };

  const handleChangeMonth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMonth(event.target.value);
  };
  const handleChangeYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchYear(event.target.value);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 2,
      }}
    >
      <Grid container spacing={1}>
        {prop.jwt_token &&
          (jwtDecode(prop.jwt_token) as { role: string }).role ===
            "farmers" && (
            <>
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 2,
                }}
              >
                <Divider textAlign="left">
                  <Typography variant="h6">คำเชิญเข้าร่วม</Typography>
                </Divider>
              </Grid>
              <>
                <Grid
                  item
                  xs={12}
                  sx={{
                    marginTop: 2,
                  }}
                >
                  <DataGrid
                    rows={myEvent.reduce((acc, cur) => {
                      return [
                        ...acc,
                        ...cur.products.filter((product) => {
                          // if (product.selectedType === "สินค้าจัดส่งพัสดุ")
                          return {
                            ...product,
                            farmerstorename: cur.title,
                            campaign_id: cur.id,
                          };
                        }),
                      ];
                    }, [] as Product[])}
                    columns={[
                      {
                        field: "farmerstorename",
                        headerName: "ร้านค้า",
                        flex: 1,
                      },
                      {
                        field: "name",
                        headerName: "ชื่อสินค้า",
                        flex: 1,
                      },
                      { field: "stock", headerName: "จำนวนคลัง", flex: 1 },
                      { field: "price", headerName: "ราคา/หน่วย", flex: 1 },
                      { field: "unit", headerName: "หน่วย", flex: 1 },
                      {
                        field: "action",
                        headerName: "สถานะ",
                        flex: 1,

                        renderCell: (params) => {
                          console.log(params);
                          return (
                            <>
                              <Chip
                                label="เข้าร่วม"
                                color="primary"
                                onClick={() => {
                                  console.log(params);
                                  const data = {
                                    is_accept: "accept",
                                  };
                                  axios
                                    .put(
                                      config.getApiEndpoint(
                                        `campaign/${params.row.festivalId}/${params.row.id}`,
                                        "PUT"
                                      ),
                                      data,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${prop.jwt_token}`,
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      axios
                                        .get(
                                          config.getApiEndpoint(
                                            "festivaldetail",
                                            "GET"
                                          ),
                                          {
                                            headers: {
                                              Authorization: `Bearer ${prop.jwt_token}`,
                                            },
                                          }
                                        )
                                        .then((res) => {
                                          console.log(res.data);
                                          setMyEvent(res.data.festivals);
                                        })
                                        .catch((err) => {
                                          console.error(err);
                                        });
                                    });
                                }}
                              />
                              <Chip
                                label="ไม่เข้าร่วม"
                                color="error"
                                onClick={() => {
                                  const data = {
                                    is_accept: "reject",
                                  };
                                  axios
                                    .put(
                                      config.getApiEndpoint(
                                        `campaign/${params.row.festivalId}/${params.row.id}`,
                                        "PUT"
                                      ),
                                      data,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${prop.jwt_token}`,
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      axios
                                        .get(
                                          config.getApiEndpoint(
                                            "festivaldetail",
                                            "GET"
                                          ),
                                          {
                                            headers: {
                                              Authorization: `Bearer ${prop.jwt_token}`,
                                            },
                                          }
                                        )
                                        .then((res) => {
                                          console.log(res.data);
                                          setMyEvent(res.data.festivals);
                                        })
                                        .catch((err) => {
                                          console.error(err);
                                        });
                                    });
                                }}
                              />
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </Grid>
              </>
            </>
          )}

        <Grid
          item
          xs={12}
          sx={{
            marginTop: 2,
          }}
        >
          <Divider textAlign="left">
            <Typography variant="h6">ปฏิทินเทศกาล</Typography>
          </Divider>
        </Grid>
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
        <Grid
          item
          xs={12}
          sx={{
            marginTop: 2,
          }}
        >
          <Divider textAlign="left">
            <Typography variant="h6">รายละเอียดเทศกาล</Typography>
          </Divider>
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="เดือน"
            fullWidth
            value={searchMonth}
            onChange={handleChangeMonth}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {month.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="ปี"
            fullWidth
            value={searchYear}
            onChange={handleChangeYear}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {Array.from(
              new Set([
                ...events.map((event) => event.start.getFullYear()),
                ...events.map((event) => event.end.getFullYear()),
              ])
            ).map((year: number) => (
              <MenuItem key={year} value={year}>
                {year + 543}
              </MenuItem>
            ))}
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
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography variant="h6">{selectedEvent?.title}</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography>
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
        {selectedEvent ? (
          <>
            {showProduct.filter(
              (item) => item.selectedType === "สินค้าจัดส่งพัสดุ"
            ) && (
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 2,
                }}
              >
                <Divider textAlign="left">
                  <Typography>สินค้าจัดส่งพัสดุ</Typography>
                </Divider>
                <DataGrid
                  onRowClick={(params) => {
                    return (
                      <Navigate
                        to={`/shop/${params.row.farmerstorename}/${params.row.id}`}
                      />
                    );
                  }}
                  rows={showProduct.filter(
                    (item) => item.selectedType === "สินค้าจัดส่งพัสดุ"
                  )}
                  columns={[
                    {
                      field: "farmerstorename",
                      headerName: "ร้านค้า",
                      flex: 1,
                    },
                    {
                      field: "product_name",
                      headerName: "ชื่อสินค้า",
                      flex: 1,
                    },
                    { field: "stock", headerName: "จำนวนคลัง", flex: 1 },
                    { field: "price", headerName: "ราคา/หน่วย", flex: 1 },
                    { field: "unit", headerName: "หน่วย", flex: 1 },
                    {
                      field: "is_accept",
                      headerName: "สถานะ",
                      flex: 1,
                    },
                  ]}
                />
              </Grid>
            )}
            {showProduct.filter(
              (item) => item.selectedType === "จองสินค้าผ่านเว็บไซต์"
            ).length > 0 && (
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 6,
                }}
              >
                <Divider textAlign="left">
                  <Typography>สินค้าจองสินค้าผ่านเว็บไซต์</Typography>
                </Divider>
                <DataGrid
                  rows={showProduct.filter(
                    (item) => item.selectedType === "จองสินค้าผ่านเว็บไซต์"
                  )}
                  columns={[
                    {
                      field: "farmerstorename",
                      headerName: "ร้านค้า",
                      flex: 1,
                    },
                    {
                      field: "product_name",
                      headerName: "ชื่อสินค้า",
                      flex: 1,
                    },
                    {
                      field: "is_accept",
                      headerName: "สถานะ",
                      flex: 1,
                    },
                    {
                      field: "action",
                      headerName: "ไปยังสินค้า",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <NavLink
                            to={`/shop/${params.row.farmerstorename}/${params.row.id}`}
                          >
                            <Chip label="ไปเลย" color="primary" />
                          </NavLink>
                        );
                      },
                    },
                  ]}
                />
              </Grid>
            )}
            {showProduct.filter((item) => item.selectedType === "ประชาสัมพันธ์")
              .length > 0 && (
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 6,
                }}
              >
                <Divider textAlign="left">
                  <Typography>สินค้าประชาสัมพันธ์</Typography>
                </Divider>
                <DataGrid
                  rows={showProduct.filter(
                    (item) => item.selectedType === "ประชาสัมพันธ์"
                  )}
                  columns={[
                    {
                      field: "farmerstorename",
                      headerName: "ร้านค้า",
                      flex: 1,
                    },
                    {
                      field: "product_name",
                      headerName: "ชื่อสินค้า",
                      flex: 1,
                    },
                    { field: "stock", headerName: "จำนวนคลัง", flex: 1 },
                    { field: "price", headerName: "ราคา/หน่วย", flex: 1 },
                    { field: "unit", headerName: "หน่วย", flex: 1 },
                    {
                      field: "is_accept",
                      headerName: "สถานะ",
                      flex: 1,
                    },
                  ]}
                />
              </Grid>
            )}
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Container>
  );
};

export default Festival;
