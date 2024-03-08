import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Container,
  Badge,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Cookies from "universal-cookie";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Cart } from "../App";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import * as config from "../config/config";
import axios from "axios";

interface Page {
  name: string;
  path: string;
}

const Navbar = (prop: {
  role: string;
  username: string;
  jwt_token: string;
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
  cartList: Cart[];
  notification: {
    id: string;
    is_unread: boolean;
    link: string;
    message: string;
    timesent: string;
    type: string;
  }[];
  setNotification: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        is_unread: boolean;
        link: string;
        message: string;
        timesent: string;
        type: string;
      }[]
    >
  >;
}) => {
  const [visiblePages, setVisiblePages] = React.useState<Page[]>([]);
  const defaultPages = [{ name: "สินค้าทั้งหมด", path: "/listproduct" }];

  const settings = [
    { name: "แก้ไขข้อมูลส่วนตัว", path: "/editprofile" },
    { name: "ออกจากระบบ", path: "/" },
  ];
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (name: string, path: string) => {
    const cookies = new Cookies();
    setAnchorElUser(null);
    if (name == "ออกจากระบบ" && path == "/") {
      prop.setJwt_token("");
      setVisiblePages([...defaultPages]);
      if (cookies.get("jwt_token")) {
        cookies.remove("jwt_token");
      }
    }
  };

  useEffect(() => {
    if (!prop.role) {
      setVisiblePages(defaultPages);
    } else if (prop.role == "admins") {
      setVisiblePages([
        ...defaultPages,
        { name: "จัดการสมาชิก", path: "/manageuser" },
        { name: "การตั้งค่า", path: "/setting" },
      ]);
    } else if (prop.role == "farmers") {
      setVisiblePages([
        ...defaultPages,
        { name: "ข้อมูลสินค้าของฉัน", path: "/myproducts" },
      ]);
    } else if (prop.role == "providers") {
      setVisiblePages([
        ...defaultPages,
        { name: "ข้อมูลเกษตรกร", path: "/datafarmer" },
      ]);
    } else if (prop.role == "tambons") {
      setVisiblePages([
        ...defaultPages,
        { name: "ข้อมูลเกษตรกร", path: "/datafarmer" },
        { name: "จัดการเกษตรกร", path: "/managefarmer" },
      ]);
    } else if (prop.role == "members") {
      setVisiblePages([
        ...defaultPages,
        { name: "ประวัติการซื้อขาย", path: "/orderlist" },
      ]);
    } else if (prop.role == "") {
      setVisiblePages([...defaultPages]);
    }
  }, [prop.role]);

  return (
    <React.Fragment>
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(0deg, rgba(206,222,189,1) 31%, rgba(250,241,228,1) 100%)",
          color: "#129549",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* computer */}
            <IconButton sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <img
                src={require("../assets/karsetnont.png")}
                alt="Italian Trulli"
                height="40px"
              ></img>
            </IconButton>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "black",
                }}
              >
                ของเด็ดเกษตรนนท์
              </Typography>
            </NavLink>
            {/* phone */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {visiblePages.map((page, index) => (
                  <NavLink
                    to={page.path}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <MenuItem key={index} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </NavLink>
                ))}
              </Menu>
            </Box>
            {/* phone */}
            <NavLink
              to="/"
              style={{ textDecoration: "none", alignItems: "center" }}
            >
              <IconButton sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
                <img
                  src={require("../assets/karsetnont.png")}
                  alt="Italian Trulli"
                  height="30px"
                ></img>
              </IconButton>
            </NavLink>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                  display: { xs: "flex", md: "none" },
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "black",
                  fontSize: "20px",
                }}
              >
                ของเด็ดเกษตรนนท์
              </Typography>
            </NavLink>

            {/* computer */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {visiblePages.map((page, index) => (
                <NavLink to={page.path} style={{ textDecoration: "none" }}>
                  <Button
                    key={index}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "black", display: "block" }}
                  >
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      {page.name}
                    </Typography>
                  </Button>
                </NavLink>
              ))}
            </Box>
            {prop.role == "members" && (
              <>
                <Badge badgeContent={prop.cartList.length} color="primary">
                  <NavLink
                    to="/listcart"
                    style={{
                      color: "green",
                    }}
                  >
                    <ShoppingCartIcon />
                  </NavLink>
                </Badge>
              </>
            )}

            {prop.role == "members" || prop.role == "farmers" ? (
              <>
                <Badge
                  badgeContent={
                    prop.notification ? prop.notification.length : 0
                  }
                  color="primary"
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  {prop.notification.length > 0 ? (
                    <NotificationsActiveIcon />
                  ) : (
                    <NotificationsIcon />
                  )}
                </Badge>
                {/* {prop.notification.map((noti, index) => (
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={() => {
                      setAnchorEl(null);
                    }}
                    sx={{
                      marginTop: "40px",
                    }}
                  >
                    <NavLink to={noti.link} style={{ textDecoration: "none" }}>
                      <MenuItem
                        key={index}
                        onClick={() => {
                          const apiNotification = config.getApiEndpoint(
                            "notification",
                            "post"
                          );
                          axios
                            .post(
                              apiNotification,
                              {
                                id: noti.id,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${prop.jwt_token}`,
                                },
                              }
                            )
                            .then(() => {
                              let tmp = JSON.parse(
                                JSON.stringify(prop.notification)
                              );
                              tmp.splice(index, 1);
                              prop.setNotification(tmp);
                              setAnchorEl(null);
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      >
                        <Stack direction="column" spacing={1}>
                          <Stack>
                            <Typography
                              sx={{ color: "black", fontWeight: "bold" }}
                            >
                              {noti.message}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography
                              sx={{ color: "gray", textAlign: "right" }}
                            >
                              {new Date(noti.timesent).toLocaleString()}
                            </Typography>
                          </Stack>
                        </Stack>
                      </MenuItem>
                    </NavLink>
                  </Menu>
                ))} */}
              </>
            ) : null}
            <Box sx={{ flexGrow: 0 }}>
              {/* computer */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {!prop.role && (
                  <NavLink to="/login" style={{ textDecoration: "none" }}>
                    <Button startIcon={<AccountCircle />}>เข้าสู่ระบบ</Button>
                  </NavLink>
                )}
                {prop.role && (
                  <Button
                    startIcon={<AccountCircle />}
                    onClick={handleOpenUserMenu}
                  >
                    {prop.username}
                  </Button>
                )}
              </Box>
              {/* phone */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                {!prop.role && (
                  <NavLink to="/Login" style={{ textDecoration: "none" }}>
                    <Tooltip title="เข้าสู่ระบบ">
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                      >
                        <AccountCircle />
                      </IconButton>
                    </Tooltip>
                  </NavLink>
                )}
                {prop.role && (
                  <Tooltip title={prop.role}>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleOpenUserMenu}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <NavLink to={setting.path} style={{ textDecoration: "none" }}>
                    <MenuItem
                      key={index}
                      onClick={() =>
                        handleCloseUserMenu(setting.name, setting.path)
                      }
                    >
                      <Typography textAlign="center" sx={{ color: "black" }}>
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  </NavLink>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;
