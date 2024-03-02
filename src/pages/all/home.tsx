import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { InputBase, IconButton, Container, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { Icon, LatLngLiteral, divIcon } from "leaflet";
import * as config from "../../config/config";
import { Tabs, Tab } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSearchParams } from "react-router-dom";
import { RGBColor } from "react-color";
import SwipeableEdgeDrawer from "../../components/SwipeableEdgeDrawer";

interface CateagoryInterface {
  category_id: string;
  category_name: string;
  bgcolor?: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = React.useState("0");
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

  useEffect(() => {
    console.log(
      searchParams.get("category"),
      selectedCategory.category_id,
      page
    );

    if (searchParams.get("category") !== selectedCategory.category_id) {
      setPage("0");
    }

    setSearchParams({
      ["search"]: searchContent,
      ["category"]: selectedCategory.category_id,
      ["sort"]: "view_count",
      ["order"]: "desc",
      ["page"]: page,
    });

    axios
      .get(apiProducts, {
        params: {
          ["search"]: searchContent,
          ["category"]: selectedCategory.category_id,
          ["page"]: (parseInt(page) - 1).toString(),
          ["sort"]: "view_count",
          ["order"]: "desc",
        },
      })
      .then((res) => {
        setData(res.data.products);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategory, page, searchContent]);

  useEffect(() => {
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

  return (
    <div>
      <SwipeableEdgeDrawer
        open={open}
        setOpen={setOpen}
        selectedProduct={selectedProduct}
      />
      <MapContainer
        center={[13.736717, 100.523186]}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100vh",
          zIndex: 1,
          maxHeight: "calc(100vh - 80px)"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map((item, index) => {
          const markerHtmlStyles = `
            background-color: ${myCustomColour(item.category_id)};
            width: 3rem;
            height: 3rem;
            display: block;
            left: -1.5rem;
            top: -1.5rem;
            position: relative;
            border-radius: 3rem 3rem 0;
            transform: rotate(45deg);
            border: 1px solid #FFFFFF`;

          const iconMarker = divIcon({
            className: "my-custom-pin",
            iconAnchor: [0, 24],
            popupAnchor: [0, -36],
            html: `<span style="${markerHtmlStyles}" />`,
          });

          return (
            item.lat && (
              <Marker
                key={index}
                position={[parseFloat(item.lat), parseFloat(item.lng)]}
                icon={iconMarker}
                eventHandlers={{
                  click: () => {
                    setOpen(true);
                    setSelectedProduct(item);
                  },
                }}
              ></Marker>
            )
          );
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
    transform: "translateX(-50%)" ,
    '@media (max-width: 600px)': {
      left: "initial",
      transform: "initial",
      marginLeft: "auto",
      marginRight: "auto",
    }
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: "100px",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "white",
            paddingLeft: "10px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
          }}
        >
          <InputBase
            sx={{
              width: "100%",
            }}
            placeholder="ค้นหาสินค้า"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
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
                    sx={{ fill: isDark(bgcolor) ? "white" : "black" }}
                  />
                }
                sx={{
                  backgroundColor: `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bgcolor.a})`,
                  color: `${isDark(bgcolor) ? "white" : "black"}`,
                  marginRight: "5px",
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
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
