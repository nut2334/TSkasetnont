import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TabLogin from "./components/tab-login";
import TabProducts from "./components/tab-products";
import Forgot from "./pages/forgot";
import Home from "./pages/home";
import AddProduct from "./pages/addproduct";
import "./App.css";
import Cookies from "universal-cookie";
import axios from "axios";
import Navbar from "./components/navbar";
import {jwtDecode } from "jwt-decode";

function App() {
  const [jwt_token, setJwt_token] = React.useState("");
  const [decodeJWT, setDecodeJWT] = React.useState({ role: "", username: "" });

  useEffect(() => {
    const cookies = new Cookies();
    const cookie_jwt_token = cookies.get("jwt_token");
    
    if (typeof cookie_jwt_token !== "undefined") {
      setJwt_token(cookie_jwt_token);
      axios
        .get("http://localhost:3001/login", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        })
        .then(() => {
          console.log("jwt_token is valid");
          const jwt =jwtDecode(jwt_token) as {role:string, username:string};
          setDecodeJWT(jwt);
        })
        .catch(() => {
          cookies.remove("jwt_token");
        });
    }
  }, []);

  useEffect(() => {
    if(jwt_token == "") return;console.log("useEffect jwt_token");
    console.log(jwtDecode(jwt_token));
    setDecodeJWT(jwtDecode(jwt_token));
  }, [jwt_token]);

  return (
    <BrowserRouter>
      <Navbar username={decodeJWT.username}/>
      <Routes>
        <Route path="/" element={<Home jwt_token={jwt_token} />} />
        <Route
          path="/login"
          element={
            <TabLogin jwt_token={jwt_token} setJwt_token={setJwt_token} />
          }
        />
        <Route path="/forgot" element={<Forgot/>} />
        <Route
          path="/myproducts"
          element={<TabProducts jwt_token={jwt_token} />}
        />
        {/* { decodeJWT.role =="farmer" && <Route path="/myproducts" element={<TabProducts jwt_token={jwt_token}/>} />} */}
        <Route path="/addproduct" element={<AddProduct jwt_token={jwt_token} username={decodeJWT.username}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
