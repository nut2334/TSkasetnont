import React, { useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Divider } from "@mui/material";
import { is } from "date-fns/locale";

const Path = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);

  useEffect(() => {
    if (pathnames.includes("editproduct")) {
      setIsEdit(true);
    }
  }, []);

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
          if (value == "manageuser") {
            value = "จัดการผู้ใช้งาน";
            return <Typography>{value}</Typography>;
          }
          if (value == "farmers") {
            value = "เกษตรกร";
          }
          if (value == "admins") {
            value = "ผู้ดูแลระบบ";
          }
          if (value == "tambons") {
            value = "เกษตรตำบล";
          }
          if (value == "members") {
            value = "สมาชิก";
          }
          if (value == "providers") {
            value = "เกษตรจังหวัด";
          }
          if (value == "all") {
            value = "ผู้ใช้งานทั้งหมด";
          }
          if (value == "adduser") {
            value = "เพิ่มผู้ใช้งาน";
            return <Typography>{value}</Typography>;
          }
          if (value == "addproduct") {
            value = "เพิ่มสินค้า";
            return <Typography>{value}</Typography>;
          }
          if (value == "editproduct") {
            console.log("editproduct");
            value = "แก้ไขสินค้า";
            // setIsEdit(true);
            return <Typography>{value}</Typography>;
          }

          return last || isEdit ? (
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
