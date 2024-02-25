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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Cookies from "universal-cookie";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Page {
  name: string;
  path: string;
}

const Navbar = (prop: {
  role: string;
  username: string;
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
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
      if (cookies.get("jwt_token")) {
        cookies.remove("jwt_token");
      }
    }
  };

  useEffect(() => {
    if (prop.role == "admins") {
      setVisiblePages([
        ...defaultPages,
        { name: "จัดการสมาชิก", path: "/manageuser" },
        { name: "การตั้งค่า", path: "/setting" },
      ]);
    }
    if (prop.role == "farmers") {
      setVisiblePages([
        ...defaultPages,
        { name: "จัดการสินค้า", path: "/myproducts" },
        { name: "วิเคราะห์สินค้า", path: "/analyze" },
        { name: "ประวัติการซื้อขาย", path: "/history" },
      ]);
    }
    if (prop.role == "tambons") {
      setVisiblePages([
        ...defaultPages,
        { name: "ข้อมูลเกษตรกร", path: "/datafarmer" },
        { name: "จัดการเกษตรกร", path: "/managefarmer" },
      ]);
    }
    if (prop.role == "members") {
      setVisiblePages([
        ...defaultPages,
        { name: "ประวัติการซื้อขาย", path: "/orderlist" }
      ]);
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
                  <NavLink to={page.path} style={{ textDecoration: "none" }}>
                    <MenuItem key={index} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </NavLink>
                ))}
              </Menu>
            </Box>
            {/* phone */}
            <NavLink to="/" style={{ textDecoration: "none" }}>
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
                  flexGrow: 1,
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "black",
                  fontSize: 18,
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
              <NavLink to="/listcart">
                <ShoppingCartIcon />
              </NavLink>
            )}
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
