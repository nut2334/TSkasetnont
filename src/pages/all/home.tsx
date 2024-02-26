import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { InputBase, IconButton, Container } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Home = (prop: { jwt_token: string }) => {
  const [searchContent, setSearchContent] = React.useState("");
  const [search, setSearch] = React.useState("");

  useEffect(() => {}, []);

  return (
    <div>
      <Container maxWidth="lg">
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingLeft: "10px",
            marginBottom: "20px",
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
        <MapContainer
          center={[13.736717, 100.523186]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[13.736717, 100.523186]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
        {prop.jwt_token}
      </Container>
    </div>
  );
};

export default Home;
