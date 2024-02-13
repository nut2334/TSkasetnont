import * as React from "react";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Register from "../pages/all/register";
import Login from "../pages/all/login";
import Logo from "../assets/karsetnont.png";

const TabLogin = (prop: {
  jwt_token: string;
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", marginTop: 3 }}>
      {prop.jwt_token}
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
          <Login setJwt_token={prop.setJwt_token} />
        </TabPanel>
        <TabPanel value="2">
          <Register setValue={setValue} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TabLogin;
