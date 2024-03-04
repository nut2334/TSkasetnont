import React from "react";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PieChartIcon from "@mui/icons-material/PieChart";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import Myproducts from "../pages/farmer/myproducts";
import Orderhistory from "../pages/farmer/orderhistory";
import Analyze from "../pages/farmer/analyze";

const TabProducts = (prop: { jwt_token: string; username: string }) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1", marginTop: 3 }}>
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              icon={<LocalGroceryStoreIcon />}
              label="จัดการสินค้า"
              value="1"
            />
            <Tab icon={<PieChartIcon />} label="วิเคราะห์สินค้า" value="2" />
            <Tab
              icon={<QueryBuilderIcon />}
              label="ประวัติการซื้อขาย"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Myproducts jwt_token={prop.jwt_token} username={prop.username} />
        </TabPanel>
        <TabPanel value="2">
          <Analyze jwt_token={prop.jwt_token} />
        </TabPanel>
        <TabPanel value="3">
          <Orderhistory jwt_token={prop.jwt_token} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TabProducts;
