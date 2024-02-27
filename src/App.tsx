import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Reserve from "./pages/member/reserve";
import Payment from "./pages/member/payment";
import Orderlist from "./pages/member/orderlist";

export interface Cart {
  product_id: string;
  quantity: number;
  product_name: string;
  price: number;
  stock: number;
}

function App() {
  const apiLogin = config.getApiEndpoint("login", "GET");
  const [jwt_token, setJwt_token] = React.useState("");
  const [decodeJWT, setDecodeJWT] = React.useState({ role: "", username: "" });
  const [cartList, setCartList] = React.useState<Cart[]>([]);

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
    setDecodeJWT(jwtDecode(jwt_token));
  }, [jwt_token]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar
          role={decodeJWT.role}
          username={decodeJWT.username}
          setJwt_token={setJwt_token}
          cartList={cartList}
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
          <Route
            path="/shop/:productid"
            element={
              <SigleProduct setCartList={setCartList} cartList={cartList} />
            }
          />
          {decodeJWT.role && (
            <Route
              path="/editprofile"
              element={<EditProfile jwt_token={jwt_token} />}
            />
          )}
          {decodeJWT.role == "farmers" && (
            <React.Fragment>
              <Route
                path="/myproducts"
                element={
                  <TabProducts
                    jwt_token={jwt_token}
                    username={decodeJWT.username}
                  />
                }
              />
              <Route
                path="/addproduct"
                element={
                  <AddProduct
                    jwt_token={jwt_token}
                    username={decodeJWT.username}
                  />
                }
              />
              <Route
                path="/editproduct/:productid"
                element={
                  <AddProduct
                    jwt_token={jwt_token}
                    username={decodeJWT.username}
                  />
                }
              />
            </React.Fragment>
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
                element={<ManageUser jwt_token={jwt_token} />}
              />
            </React.Fragment>
          )}
          {decodeJWT.role == "members" && (
            <>
              <Route
                path="/listcart"
                element={<ListCart setCartList={setCartList} cartList={cartList} jwt_token={jwt_token} />}
              />
              <Route path="/reservation/:productid" element={<Reserve />} />

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
                element={<ManageUser jwt_token={jwt_token} />}
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
