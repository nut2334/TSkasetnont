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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
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
}

const Home = (prop: { jwt_token: string }) => {
  const apiProducts = config.getApiEndpoint("getproducts", "GET");
  const apiCategories = config.getApiEndpoint("categories", "GET");

  const [searchContent, setSearchContent] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<
    {
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
    }[]
  >([]);
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
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<{
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
  }>({
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
  });
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 13.849861759515747,
    lng: 100.52318572998047,
  });
  const [productPage, setProductPage] = useState<ProductInterface[]>([]);
  const [page, setPage] = useState(1);

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

  useEffect(() => {}, [page, data]);

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

  const isDark = (color: RGBColor) => {
    var luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // per ITU-R BT.709
    if (luma < 128) {
      return true;
    } else {
      return false;
    }
  };

  const CreateMarker = (props: {
    item: {
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
    };
  }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([position.lat, position.lng], 17);
    }, [position]);
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
          },
        }}
      ></Marker>
    ) : null;
  };

  return (
    <div>
      <SwipeableEdgeDrawer
        open={open}
        setOpen={setOpen}
        selectedProduct={selectedProduct}
      />
      <Box
        sx={{
          height: "100%",
          width: "250px",
          position: "absolute",
          zIndex: 2,
          backgroundColor: "#ffffff",
          padding: "10px",
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
        }}
      >
        {data.map((item, index) => {
          return (
            <Typography
              key={index}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  color: "green",
                },
              }}
              onClick={() => {
                setOpen(true);
                setSelectedProduct(item);
                if (item.lat && item.lng) {
                  setPosition({
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng),
                  });
                }
              }}
            >
              {item.product_name}
            </Typography>
          );
        })}
        <Pagination
          count={Math.ceil(data.length / 2)}
          page={parseInt(value)}
          onChange={handleChange}
        />
      </Box>
      <MapContainer
        center={[13.849861759515747, 100.52318572998047]}
        zoom={13}
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
      <Container
        maxWidth="lg"
        sx={{
          position: "absolute",
          zIndex: 2,
          top: "10%",
          width: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          "@media (max-width: 600px)": {
            left: "initial",
            transform: "initial",
            marginLeft: "auto",
            marginRight: "auto",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: "100px",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "white",
            paddingLeft: "30px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
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
                  // backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                  backgroundColor: "white",
                  color: "black",
                  // color: `${isDark(bgcolor) ? "white" : "black"}`,
                  marginRight: "5px",
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
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
    </div>
  );
};

export default Home;
