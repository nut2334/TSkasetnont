import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import TabLogin from "./components/tab-login";
import TabProducts from "./components/tab-products";
import Forgot from "./pages/all/forgot";
import Home from "./pages/all/home";
import AddProduct from "./pages/farmer/addproduct";
import AddUser from "./pages/adduser";
import SettingAdmin from "./pages/admin/setting";
import "./App.css";
import Cookies from "universal-cookie";
import axios from "axios";
import Navbar from "./components/navbar";
import { jwtDecode } from "jwt-decode";
import * as config from "./config/config";
import ManageUser from "./pages/admin/manageuser";
import { ThemeProvider } from "@emotion/react";
import theme from "./themeMui";
import ListProduct from "./pages/all/listproduct";
import SigleProduct from "./pages/all/singleproduct";
import EditProfile from "./pages/editprofile";
import ListCart from "./pages/member/listcart";
import Orderlist from "./pages/member/orderlist";
import { MessengerChat } from "react-messenger-chat-plugin";
import Myproducts from "./pages/farmer/myproducts";
import ExcelDownload from "./pages/provider/exceldownload";
import Certification from "./pages/admin/certification";

export interface Cart {
  product_id: string;
  quantity: number;
  product_name: string;
  price: number;
  stock: number;
  farmer_id: string;
  weight: number;
  shippingcost: string;
}

function App() {
  const apiLogin = config.getApiEndpoint("login", "GET");
  const [jwt_token, setJwt_token] = React.useState("");
  const [decodeJWT, setDecodeJWT] = React.useState({ role: "", username: "" });
  const [cartList, setCartList] = React.useState<Cart[]>([]);
  const [followList, setFollowList] = React.useState<
    {
      id: string;
      farmerstorename: string;
    }[]
  >([]);
  const [notification, setNotification] = React.useState<
    {
      id: string;
      is_unread: boolean;
      link: string;
      message: string;
      timesent: string;
      type: string;
    }[]
  >([]);

  useEffect(() => {
    const cookies = new Cookies();
    const cookie_jwt_token = cookies.get("jwt_token");
    if (typeof cookie_jwt_token !== "undefined") {
      setJwt_token(cookie_jwt_token);
      axios
        .get(apiLogin, {
          headers: {
            Authorization: `Bearer ${cookie_jwt_token}`,
          },
        })
        .then((res) => {
          let { isValid, newToken } = res.data;
          if (isValid) {
            const jwt = jwtDecode(newToken) as {
              role: string;
              username: string;
            };
            setJwt_token(newToken);
            setDecodeJWT(jwt);
          }
        })
        .catch(() => {
          alert("Token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
          cookies.remove("jwt_token");
          setJwt_token("");
        });
    }
  }, []);

  useEffect(() => {
    if (jwt_token == "") {
      setDecodeJWT({ role: "", username: "" });
      return;
    }
    let decodeJWT = jwtDecode(jwt_token) as { role: string; username: string };
    setDecodeJWT(decodeJWT);

    if (decodeJWT.role == "members") {
      const apiFollow = config.getApiEndpoint("followfarmer", "GET");

      axios
        .get(apiFollow, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        })
        .then((res) => {
          let response: { id: string; farmerstorename: string }[] =
            res.data.data;

          setFollowList(response);
          console.log(followList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (decodeJWT.role == "members" || decodeJWT.role == "farmers") {
      const apiNotification = config.getApiEndpoint("notification", "GET");
      axios
        .get(apiNotification, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        })
        .then((res) => {
          setNotification(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [jwt_token]);

  //polling notification
  useEffect(() => {
    if (decodeJWT.role == "members" || decodeJWT.role == "farmers") {
      const interval = setInterval(() => {
        const apiNotification = config.getApiEndpoint("notification", "GET");
        axios
          .get(apiNotification, {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
          })
          .then((res) => {
            setNotification(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [jwt_token, decodeJWT.role]);

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Navbar
          role={decodeJWT.role}
          jwt_token={jwt_token}
          username={decodeJWT.username}
          setJwt_token={setJwt_token}
          cartList={cartList}
          notification={notification}
          setNotification={setNotification}
        />

        <Routes>
          <Route path="/" element={<Home jwt_token={jwt_token} />} />
          <Route
            path="/login"
            element={
              <TabLogin jwt_token={jwt_token} setJwt_token={setJwt_token} />
            }
          />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/shop/:shopname" element={<ListProduct />} />
          <Route
            path="/shop/:shopname/:productid"
            element={
              <SigleProduct
                setCartList={setCartList}
                cartList={cartList}
                jwt_token={jwt_token}
                followList={followList}
                setFollowList={setFollowList}
              />
            }
          />
          {decodeJWT.role && (
            <Route
              path="/editprofile"
              element={
                <EditProfile
                  jwt_token={jwt_token}
                  followList={followList}
                  setFollowList={setFollowList}
                />
              }
            />
          )}
          {decodeJWT.role == "farmers" && (
            <Route
              path="/myproducts"
              element={
                <TabProducts
                  jwt_token={jwt_token}
                  username={decodeJWT.username}
                />
              }
            />
          )}
          {(decodeJWT.role == "farmers" || decodeJWT.role == "tambons") && (
            <React.Fragment>
              <Route
                path="/addproduct/:username"
                element={<AddProduct jwt_token={jwt_token} />}
              />
              <Route
                path="/editproduct/:shopname/:username/:productid"
                element={<AddProduct jwt_token={jwt_token} />}
              />
            </React.Fragment>
          )}
          {(decodeJWT.role == "tambons" || decodeJWT.role == "providers") && (
            <Route
              path="/datafarmer"
              element={<ExcelDownload jwt_token={jwt_token} />}
            />
          )}
          {decodeJWT.role == "admins" && (
            <React.Fragment>
              <Route
                path="/setting"
                element={<SettingAdmin jwt_token={jwt_token} />}
              />
              <Route
                path="/adduser"
                element={<AddUser jwt_token={jwt_token} />}
              />
              <Route
                path="/manageuser"
                element={
                  <ManageUser
                    jwt_token={jwt_token}
                    followList={followList}
                    setFollowList={setFollowList}
                  />
                }
              />
              <Route
                path="/datafarmer"
                element={<ExcelDownload jwt_token={jwt_token} />}
              />
              <Route
                path="/certification"
                element={<Certification jwt_token={jwt_token} />}
              />
            </React.Fragment>
          )}
          {decodeJWT.role == "members" && (
            <>
              <Route
                path="/listcart"
                element={
                  <ListCart
                    setCartList={setCartList}
                    cartList={cartList}
                    jwt_token={jwt_token}
                  />
                }
              />

              <Route
                path="/orderlist"
                element={<Orderlist jwt_token={jwt_token} />}
              />
            </>
          )}
          {decodeJWT.role == "tambons" && (
            <>
              <Route
                path="/managefarmer"
                element={
                  <ManageUser
                    jwt_token={jwt_token}
                    followList={followList}
                    setFollowList={setFollowList}
                  />
                }
              />
              <Route
                path="/addfarmer"
                element={<AddUser jwt_token={jwt_token} addfarmer={true} />}
              />
              <Route
                path="/managefarmer/:username"
                element={<Myproducts jwt_token={jwt_token} />}
              />
            </>
          )}
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
