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
      product_price: string;
      product_image: string;
      category_id: string;
      lat: string;
      lng: string;
    }[]
  >([]);
  const [data2, setData2] = React.useState<
    {
      lat: string;
      lng: string;
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

  // useEffect(() => {
  //   axios
  //     .get(apiProducts, {
  //       params: {
  //         ["search"]: "",
  //         ["category"]: "",
  //         ["page"]: "0",
  //         ["sort"]: "view_count",
  //         ["order"]: "desc",
  //         ["perPage"]: 10,
  //         ["groupby"]: 1,
  //       },
  //     })
  //     .then((res) => {
  //       setData2(res.data.products);
  //       setData(res.data.products);
  //       console.log(res.data);
  //     });
  // }, []);

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
        console.log(res.data);
        setData(res.data.products);
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
      console.log(bgcolor);
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
      <MapContainer
        center={[13.736717, 100.523186]}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "92vh",
          zIndex: 1,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <Marker position={[13.736717, 100.523186]} icon={iconMarker}></Marker> */}
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
              >
                <Popup>
                  <div>
                    <h2>{item.product_name}</h2>
                    <p>{item.product_description}</p>
                  </div>
                </Popup>
              </Marker>
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
          left: "10%",
        }}
      >
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            flexDirection: "row",
            justifyContent: "center",
            paddingLeft: "10px",
            marginBottom: "20px",
            backgroundColor: "white",
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
        <div>{searchContent}</div>
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
                    "rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px;",
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
