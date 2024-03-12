import React from "react";
import { Box, Divider, Tab, Typography, Container } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PieChartIcon from "@mui/icons-material/PieChart";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import Myproducts from "../pages/farmer/myproducts";
import Orderhistory from "../pages/farmer/orderhistory";
import Analyze from "../pages/farmer/analyze";
import Orderreserve from "../pages/farmer/orderreserve";

const TabProducts = (prop: { jwt_token: string; username: string }) => {
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

        <TabPanel value="1">
          <Myproducts jwt_token={prop.jwt_token} username={prop.username} />
        </TabPanel>
        <TabPanel value="2">
          <Analyze jwt_token={prop.jwt_token} />
        </TabPanel>
        <TabPanel value="3">
          <Typography variant="h6">ประวัติการซื้อขาย</Typography>
          <Orderhistory jwt_token={prop.jwt_token} />
          <Divider />
          <Typography variant="h6">การจองสินค้า</Typography>
          <Orderreserve jwt_token={prop.jwt_token} />
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default TabProducts;
