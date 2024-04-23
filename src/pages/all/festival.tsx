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
  title: string;
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
  const [productDelivery, setProductDelivery] = React.useState<Product[]>([]);
  const [productReserve, setProductReserve] = React.useState<Product[]>([]);
  const [productPromote, setProductPromote] = React.useState<Product[]>([]);

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    console.log(productDelivery);
    console.log(productReserve);
    console.log(productPromote);
  }, [productDelivery, productReserve, productPromote]);

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
    // คำเชิญเกษตรกรเข้าร่วมเทศกาล
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
          let data = res.data.festivals as FestivalDetail[];
          setProductDelivery(
            data.reduce((acc, cur) => {
              return [
                ...acc,
                ...cur.products
                  .filter(
                    (product) => product.selectedType === "สินค้าจัดส่งพัสดุ"
                  )
                  .map((product) => {
                    return {
                      ...product,
                      product_id: product.id,
                      id: cur.id + product.id,
                      title: cur.title,
                    };
                  }),
              ];
            }, [] as Product[])
          );
          setProductReserve(
            data.reduce((acc, cur) => {
              return [
                ...acc,
                ...cur.products
                  .filter(
                    (product) =>
                      product.selectedType === "จองสินค้าผ่านเว็บไซต์"
                  )
                  .map((product) => {
                    return {
                      ...product,
                      id: cur.id + product.id,
                      title: cur.title,
                    };
                  }),
              ];
            }, [] as Product[])
          );

          setProductPromote(
            data.reduce((acc, cur) => {
              return [
                ...acc,
                ...cur.products
                  .filter((product) => product.selectedType === "ประชาสัมพันธ์")
                  .map((product) => {
                    return {
                      ...product,
                      id: cur.id + product.id,
                      title: cur.title,
                    };
                  }),
              ];
            }, [] as Product[])
          );
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
    // ดึงข้อมูลสินค้าในเทศกาล
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
              {(productDelivery.length > 0 ||
                productReserve.length > 0 ||
                productPromote.length > 0) && (
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
              )}
              <>
                {productDelivery.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      marginTop: 10,
                    }}
                  >
                    <Divider textAlign="left">
                      <Typography>สินค้าจัดส่งพัสดุ</Typography>
                    </Divider>
                    <DataGrid
                      rows={productDelivery}
                      columns={[
                        {
                          field: "title",
                          headerName: "เทศกาล",
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
                                          `campaign/${params.row.festivalId}/${params.row.product_id}`,
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
                )}
                {productReserve.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      marginTop: 10,
                    }}
                  >
                    <Divider textAlign="left">
                      <Typography>สินค้าจองสินค้าผ่านเว็บไซต์</Typography>
                    </Divider>
                    <DataGrid
                      rows={productReserve}
                      columns={[
                        {
                          field: "title",
                          headerName: "เทศกาล",
                          flex: 1,
                        },

                        {
                          field: "name",
                          headerName: "ชื่อสินค้า",
                          flex: 1,
                        },
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
                                          `campaign/${params.row.festivalId}/${params.row.product_id}`,
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
                                          `campaign/${params.row.festivalId}/${params.row.product_id}`,
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
                )}
                {productPromote.length > 0 && (
                  <Grid item xs={12}>
                    <Divider textAlign="left">
                      <Typography>สินค้าประชาสัมพันธ์</Typography>
                    </Divider>
                    <DataGrid
                      rows={productPromote}
                      columns={[
                        {
                          field: "title",
                          headerName: "เทศกาล",
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
                )}
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
                        to={`/listproduct/${params.row.farmerstorename}/${params.row.id}`}
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
                    {
                      field: "action",
                      headerName: "ไปยังสินค้า",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <NavLink
                            to={`/listproduct/${params.row.farmerstorename}/${params.row.id}`}
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
                            to={`/listproduct/${params.row.farmerstorename}/${params.row.id}`}
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
                    {
                      field: "action",
                      headerName: "ไปยังสินค้า",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <NavLink
                            to={`/listproduct/${params.row.farmerstorename}/${params.row.id}`}
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
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Container>
  );
};

export default Festival;
