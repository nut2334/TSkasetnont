import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TabLogin from "./components/tab-login";
import TabProducts from "./components/tab-products";
import Forgot from "./pages/forgot";
import Home from "./pages/home";
import "./App.css";
import Cookies from "universal-cookie";
import axios from "axios";

function App() {
  const [jwt_token, setJwt_token] = React.useState("");
  const [username, setUsername] = React.useState({ role: "", username: "" });
  useEffect(() => {
    const cookies = new Cookies();
    const cookie_jwt_token = cookies.get("jwt_token");
    setJwt_token(cookie_jwt_token);
    if (jwt_token) {
      axios
        .get("http://localhost:3001/login", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch(() => {
          cookies.remove("jwt_token");
        });
    }
  }, []);

  return (
    <BrowserRouter>
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
        {/* { username.role =="porka" && <Route path="/myproducts" element={<TabProducts jwt_token={jwt_token}/>} />} */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
