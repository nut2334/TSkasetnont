import * as React from "react";
import {
  Box,
  Tab,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Register from "../pages/register";
import Login from "../pages/login";
import Logo from "../assets/karsetnont.png";

const TabLogin = () => {
    const [value, setValue] = React.useState("1");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
    };
  
  return (
    <Box sx={{ width: "100%", typography: "body1", marginTop: 3 }}>
      <div style={{ textAlign: "center" }}>
        <img src={Logo} height="auto" width="100px" />
      </div>
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="เข้าสู่ระบบ" value="1" />
            <Tab label="ลงทะเบียน" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Login />
        </TabPanel>
        <TabPanel value="2">
          <Register />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TabLogin;
