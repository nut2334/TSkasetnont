import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  InputBase,
  IconButton,
  Container,
  Chip,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { Icon, LatLngLiteral, divIcon } from "leaflet";
import * as config from "../../config/config";
import { Tabs, Tab } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSearchParams } from "react-router-dom";
import { RGBColor } from "react-color";
import SwipeableEdgeDrawer from "../../components/SwipeableEdgeDrawer";
import { useMap } from "react-leaflet";
import { Pagination } from "@mui/material";
import { Cart } from "../../App";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface CateagoryInterface {
  category_id: string;
  category_name: string;
  bgcolor?: string;
}

interface ProductInterface {
  product_id: string;
  product_name: string;
  product_description: string;
  price: string;
  product_image: string;
  category_id: string;
  lat: string;
  lng: string;
  farmerstorename: string;
  unit: string;
  selectedType: string;
  stock: string;
  farmer_id: string;
  weight: string;
  shippingcost: string;
  forecastDate: Date;
}

const Home = (prop: {
  jwt_token: string;
  cartList: Cart[];
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
}) => {
  const apiProducts = config.getApiEndpoint("getproducts", "GET");
  const apiCategories = config.getApiEndpoint("categoriesort", "GET");

  const [searchContent, setSearchContent] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<ProductInterface[]>([]);
  const [allCategory, setAllCategory] = React.useState<
    {
      category_id: string;
      category_name: string;
      bgcolor: string;
    }[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CateagoryInterface>({
      category_id: "",
      category_name: "ทั้งหมด",
    });
  const [value, setValue] = React.useState("1");
  const [valueEvent, setValueEvent] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductInterface>({
      product_id: "",
      product_name: "",
      product_description: "",
      price: "",
      product_image: "",
      category_id: "",
      lat: "",
      lng: "",
      farmerstorename: "",
      unit: "",
      selectedType: "",
      stock: "",
      farmer_id: "",
      weight: "",
      shippingcost: "",
      forecastDate: new Date(),
    } as ProductInterface);
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 13.810300182207499,
    lng: 100.47597885131837,
  });
  const [productPage, setProductPage] = useState<ProductInterface[]>([]);
  const [eventPage, setEventPage] = useState<
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
  const [page, setPage] = useState(1);
  const [pageEvent, setPageEvent] = useState(1);
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
  const [havePosition, setHavePosition] = useState(false);

  useEffect(() => {
    axios
      .get(apiProducts, {
        params: {
          ["search"]: searchContent,
          ["category"]: selectedCategory.category_id,
          ["page"]: "0",
          ["sort"]: "view_count",
          ["order"]: "desc",
          ["perPage"]: "999999999",
          ["groupby"]: "true",
        },
      })
      .then((res) => {
        setData(res.data.products);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategory, searchContent]);

  useEffect(() => {
    setProductPage(data.slice((page - 1) * 4, page * 4));
  }, [page, data]);

  useEffect(() => {
    setEventPage(events.slice((pageEvent - 1) * 4, pageEvent * 4));
  }, [pageEvent, events]);

  useEffect(() => {
    axios
      .get(apiCategories)
      .then((res) => {
        setAllCategory([
          {
            category_id: "",
            category_name: "ทั้งหมด",
            bgcolor: "",
          },
          ...res.data,
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
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
    });
  }, []);

  const myCustomColour = (id: string) => {
    const category = allCategory.find((item) => item.category_id === id);

    if (category) {
      const bgcolor = category.bgcolor
        ? JSON.parse(category.bgcolor)
        : ({ r: 68, g: 93, b: 72, a: 1 } as {
            r: number;
            g: number;
            b: number;
            a: number;
          });
      return `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`;
    } else {
      return "rgba(68,93,72,1)";
    }
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setValue(value.toString());
  };

  const handlePageEvent = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setValueEvent(value.toString());
  };

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };

  const CreateMarker = (props: { item: ProductInterface }) => {
    const map = useMap();
    useEffect(() => {
      havePosition && map.flyTo([position.lat, position.lng], 14);
    }, [position, havePosition]);
    const { item } = props;
    const iconMarker = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<div class="marker"
        style="
          background-color: ${myCustomColour(item.category_id)}
        "
      ></div>
        <style>
          
          .marker {
            transform: perspective(40px) rotateX(20deg) rotateZ(-45deg);
            transform-origin: 50% 50%;
            border-radius: 50% 50% 50% 0;
            padding: 0 3px 3px 0;
            width: 40px;
            height: 40px;
            
            position: relative;
            left: 50%;
            top: 50%;
            margin: -2.2em 0 0 -1.3em;
            -webkit-box-shadow: -1px 1px 4px rgba(0, 0, 0, .5);
            -moz-box-shadow: -1px 1px 4px rgba(0, 0, 0, .5);
            box-shadow: -1px 1px 4px rgba(0, 0, 0, .5);
          }

          .marker:after {
            content: '';
            width: 1.55em;
            height: 1.55em;
            margin: 1em 0 0 .7em;
            background: #ffffff;
            position: absolute;
            border-radius: 50%;
              -moz-box-shadow: 0 0 10px rgba(0, 0, 0, .5);
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .5);
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
            -moz-box-shadow: inset -2px 2px 4px hsla(0, 0, 0, .5);
            -webkit-box-shadow: inset -2px 2px 4px hsla(0, 0, 0, .5);
            box-shadow: inset -2px 2px 4px hsla(0, 0, 0, .5);
          }
        </style>
      `,
    });

    return item.lat ? (
      <Marker
        position={[parseFloat(item.lat), parseFloat(item.lng)]}
        icon={iconMarker}
        eventHandlers={{
          click: () => {
            setOpen(true);
            setSelectedProduct(item);
            setHavePosition(false);
          },
        }}
      ></Marker>
    ) : null;
  };

  try {
    return (
      <div>
        {/* กดที่หมุดเพื่อดูข้อมูลสินค้า */}
        <SwipeableEdgeDrawer
          open={open}
          setOpen={setOpen}
          selectedProduct={selectedProduct}
          jwt_token={prop.jwt_token}
          cartList={prop.cartList}
          setCartList={prop.setCartList}
        />
        <Box
          sx={{
            height: "90%",
            width: "30%",
            position: "absolute",
            zIndex: 2,
            backgroundColor: "#ffffff",
            padding: "10px",
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
          }}
          display={{ xs: "none", sm: "block" }}
        >
          <Container maxWidth="lg">
            <div
              style={{
                border: "1px solid #9c9c9c",
                display: "flex",
                borderRadius: "100px",
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "white",
                paddingLeft: "30px",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                width: "90%",
              }}
            >
              <InputBase
                sx={{
                  width: "100%",
                }}
                placeholder="ค้นหาสินค้า"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchContent(search);
                  }
                }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <IconButton
                type="button"
                sx={{ p: "10px", background: "#F5F5F5" }}
                aria-label="search"
                onClick={() => {
                  setSearchContent(search);
                }}
              >
                <SearchIcon />
              </IconButton>
            </div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon label tabs example"
              sx={{
                marginTop: "20px",
                width: "90%",
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {allCategory.map((item, index) => {
                let bgcolor = item.bgcolor
                  ? JSON.parse(item.bgcolor)
                  : ({ r: 68, g: 93, b: 72, a: 1 } as {
                      r: number;
                      g: number;
                      b: number;
                      a: number;
                    });
                return (
                  <Chip
                    key={index}
                    label={item.category_name}
                    icon={
                      <LocationOnIcon
                        sx={{
                          fill: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                        }}
                      />
                    }
                    sx={{
                      border: "1px solid #9c9c9c",
                      // backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                      backgroundColor: "white",
                      color: "black",
                      // color: `${isDark(bgcolor) ? "white" : "black"}`,
                      marginRight: "5px",
                      // boxShadow:
                      //   "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                      "&:hover": {
                        backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                      },
                    }}
                    onClick={() => setSelectedCategory(item)}
                  />
                );
              })}
            </Tabs>
          </Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <LocalFireDepartmentIcon
              sx={{
                fill: "red",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                backgroundImage:
                  "linear-gradient(319deg, #ffcb43 0%, #ff6425 37%, #ff0016 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginLeft: "10px",
              }}
            >
              สินค้าที่กำลังมาแรง
            </Typography>
          </Box>

          {productPage.map((item, index) => {
            return (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      color: "green",
                    },
                    padding: "2px 10px",
                  }}
                  onClick={() => {
                    setOpen(true);
                    setSelectedProduct(item);
                    if (item.lat && item.lng) {
                      setHavePosition(true);
                      setPosition({
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                      });
                    } else {
                      setHavePosition(false);
                    }
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundImage:
                            "linear-gradient(319deg, #ffcb43 0%, #ff6425 37%, #ff0016 100%)",
                          boxShadow: "rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          marginRight: "10px",
                        }}
                      >
                        {index + 1 + page * 5 - 5}
                      </Typography>

                      <Typography key={index}>{item.product_name}</Typography>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: "gray",
                          marginLeft: "34px",
                        }}
                      >
                        โดย {item.farmerstorename}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    {item.selectedType === "สินค้าจัดส่งพัสดุ" && (
                      <>
                        <Typography
                          sx={{
                            color: "red",
                          }}
                        >
                          {item.price} บาท / {item.unit}
                        </Typography>
                        <Typography
                          sx={{
                            color: "gray",
                          }}
                        >
                          จำนวนคลัง {item.stock} {item.unit}
                        </Typography>
                      </>
                    )}
                    {item.selectedType === "สินค้าจอง" && (
                      <Typography
                        sx={{
                          color: "red",
                        }}
                      >
                        {item.forecastDate.toLocaleDateString("th", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
              </>
            );
          })}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Pagination
              count={Math.ceil(data.length / 5)}
              page={page}
              onChange={(e, value) => {
                setPage(value);
              }}
            />
          </Box>
          <Box
            sx={{
              marginTop: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <AccessTimeIcon />
              <Typography
                variant="h6"
                sx={{
                  marginLeft: "10px",
                }}
              >
                เทศกาลที่กำลังจะมาถึง
              </Typography>
            </Box>

            {eventPage.map((event, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    padding: "2px 10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography>{event.title}</Typography>
                      <Typography>
                        {event.start.toLocaleDateString("th", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {event.end.toLocaleDateString("th", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>

                    {new Date().getTime() <= new Date(event.end).getTime() &&
                    new Date().getTime() >= new Date(event.start).getTime() ? (
                      <Chip
                        label="กำลังจัดขึ้น"
                        sx={{
                          backgroundColor: "rgba(0,255,0,0.1)",
                          color: "black",
                        }}
                      />
                    ) : (
                      <Chip
                        label="ยังไม่เริ่ม"
                        sx={{
                          backgroundColor: "rgba(255,0,0,0.1)",
                          color: "black",
                        }}
                      />
                    )}
                  </Box>

                  <Divider />
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Pagination
              count={Math.ceil(events.length / 5)}
              page={pageEvent}
              onChange={(e, value) => {
                setPageEvent(value);
              }}
            />
          </Box>
        </Box>
        <Container
          maxWidth="sm"
          sx={{
            position: "absolute",
            zIndex: 2,
            top: "10%",
            // width: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            // "@media (max-width: 600px)": {
            //   left: "initial",
            //   transform: "initial",
            //   marginLeft: "auto",
            //   marginRight: "auto",
            // },
          }}
        >
          <Box display={{ lg: "none", md: "none" }}>
            <div
              style={{
                border: "1px solid #9c9c9c",
                display: "flex",
                borderRadius: "100px",
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "white",
                paddingLeft: "30px",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                width: "90%",
              }}
            >
              <InputBase
                sx={{
                  width: "100%",
                }}
                placeholder="ค้นหาสินค้า"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchContent(search);
                  }
                }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <IconButton
                type="button"
                sx={{ p: "10px", background: "#F5F5F5" }}
                aria-label="search"
                onClick={() => {
                  setSearchContent(search);
                }}
              >
                <SearchIcon />
              </IconButton>
            </div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon label tabs example"
              sx={{
                marginTop: "20px",
                width: "90%",
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {allCategory.map((item, index) => {
                let bgcolor = item.bgcolor
                  ? JSON.parse(item.bgcolor)
                  : ({ r: 68, g: 93, b: 72, a: 1 } as {
                      r: number;
                      g: number;
                      b: number;
                      a: number;
                    });
                return (
                  <Chip
                    key={index}
                    label={item.category_name}
                    icon={
                      <LocationOnIcon
                        sx={{
                          fill: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                        }}
                      />
                    }
                    sx={{
                      border: "1px solid #9c9c9c",
                      // backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                      backgroundColor: "white",
                      color: "black",
                      // color: `${isDark(bgcolor) ? "white" : "black"}`,
                      marginRight: "5px",
                      // boxShadow:
                      //   "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                      "&:hover": {
                        backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                      },
                    }}
                    onClick={() => setSelectedCategory(item)}
                  />
                );
              })}
            </Tabs>
          </Box>
        </Container>
        <MapContainer
          center={[13.810300182207499, 100.47597885131837]}
          zoom={15}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100vh",
            zIndex: 1,
            maxHeight: "calc(100vh - 80px)",
          }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data.map((item, index) => {
            return <CreateMarker key={index} item={item} />;
          })}
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack>
          <img
            src={require("../../assets/sad.png")}
            alt="sad"
            width="200"
            height="200"
          />
        </Stack>
        <Stack>
          <Typography
            variant="h4"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              color: "gray",
            }}
          >
            เกิดข้อผิดพลาดกรุณา น้องนนท์กำลังเร่งแก้ไขน้าา
          </Typography>
        </Stack>
      </Stack>
    );
  }
};

export default Home;
