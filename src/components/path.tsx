import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Divider } from "@mui/material";

const Path = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <div
      style={{
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      <Breadcrumbs aria-label="Breadcrumb">
        <RouterLink
          color="inherit"
          to="/"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          หน้าแรก
        </RouterLink>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          if (value == "listproduct") {
            value = "สินค้าทั้งหมด";
          }

          return last ? (
            <Typography color="textPrimary" key={to}>
              {decodeURIComponent(value)}
            </Typography>
          ) : (
            <RouterLink
              color="black"
              to={to}
              key={to}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              {decodeURIComponent(value)}
            </RouterLink>
          );
        })}
      </Breadcrumbs>
      <Divider
        sx={{
          marginTop: 2,
          marginBottom: 2,
        }}
      />
    </div>
  );
};

export default Path;
