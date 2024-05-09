import React, { useEffect } from "react";
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
import axios from "axios";
import * as config from "../config/config";
import { DataGrid } from "@mui/x-data-grid";

interface memberInterface {
  id: string;
  customer_id: string;
  purchase_count: number;
  product_id: string;
  firstname: string;
  lastname: string;
  phone: string;
  username: string;
}

const TabProducts = (prop: { jwt_token: string; username: string }) => {
  const [value, setValue] = React.useState("1");
  const [historyMember, setHistoryMember] = React.useState<memberInterface[]>(
    []
  );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios
      .get(config.getApiEndpoint("membership", "GET"), {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setHistoryMember(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          {historyMember.length > 0 && (
            <>
              <Typography variant="h6">ประวัติสมาชิก</Typography>
              <DataGrid
                rows={historyMember}
                columns={[
                  { field: "username", headerName: "username", flex: 1 },
                  { field: "firstname", headerName: "ชื่อ", flex: 1 },
                  { field: "lastname", headerName: "นามสกุล", flex: 1 },
                  { field: "phone", headerName: "เบอร์", flex: 1 },
                  {
                    field: "purchase_count",
                    headerName: "จำนวนครั้งที่ซื้อ",
                    flex: 1,
                  },
                ]}
              />
            </>
          )}
          <Divider
            sx={{
              marginTop: 2,
              marginBottom: 2,
            }}
          />
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
