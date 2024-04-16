import React from "react";
import { Box, Divider, Tab, Typography, Container } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PieChartIcon from "@mui/icons-material/PieChart";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Festival from "../pages/all/festival";

const TabFestival = (prop: { jwt_token: string }) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Container maxWidth="lg">
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="lab API tabs example"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<CalendarMonthIcon />} label="ปฏิทินเทศกาล" value="1" />
          <Tab icon={<EmailIcon />} label="คำเชิญเข้าร่วม" value="2" />
        </TabList>
        <TabPanel value="1">
          <Festival jwt_token={prop.jwt_token} />
        </TabPanel>
        <TabPanel value="2">dfewfew</TabPanel>
      </TabContext>
    </Container>
  );
};

export default TabFestival;
