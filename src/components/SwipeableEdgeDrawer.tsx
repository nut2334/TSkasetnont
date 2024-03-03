import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Container, Grid } from "@mui/material";
import axios from "axios";
import * as config from "../config/config";
import StoreIcon from "@mui/icons-material/Store";
import { NavLink } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import { RWebShare } from "react-web-share";

const drawerBleeding = 56;

interface Props {
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function SwipeableEdgeDrawer(
  props: Props & {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProduct: {
      product_id: string;
      product_name: string;
      product_description: string;
      price: string;
      product_image: string;
      category_id: string;
      lat: string;
      lng: string;
      farmerstorename: string;
      unit: string;
    };
  }
) {
  const { window } = props;
  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const toggleDrawer = (newOpen: boolean) => () => {
    props.setOpen(newOpen);
    console.log(props.selectedProduct);
  };

  return (
    <Root>
      <Box>
        <CssBaseline />
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          }}
        />
        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={props.open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              {props.selectedProduct.farmerstorename || "ของเด็ดเกษตรนนท์"}
            </Typography>
          </StyledBox>
          <StyledBox
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
            }}
          >
            {
              <Grid container spacing={2} padding={2}>
                <Grid
                  item
                  xs={6}
                  sx={{
                    textAlign: "right",
                  }}
                >
                  <img
                    src={`${config.getApiEndpoint(
                      `getimage/${props.selectedProduct.product_image
                        .split("/")
                        .pop()}`,
                      "get"
                    )}`}
                    style={{
                      width: "300px",
                      aspectRatio: 1 / 1,
                      borderRadius: "25px",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {props.selectedProduct.product_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        {props.selectedProduct.product_description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h5" gutterBottom>
                        ราคา {props.selectedProduct.price} บาท /{" "}
                        {props.selectedProduct.unit}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <NavLink
                        to={`/shop/${props.selectedProduct.farmerstorename}/${props.selectedProduct.product_id}`}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<StoreIcon />}
                        >
                          เยี่ยมชมสินค้า
                        </Button>
                      </NavLink>
                    </Grid>
                    <Grid item xs={12}>
                      <RWebShare
                        data={{
                          text: `https://www.google.com/maps/search/?api=1&query=${props.selectedProduct.lat},${props.selectedProduct.lng}`,
                          url: `https://www.google.com/maps/search/?api=1&query=${props.selectedProduct.lat},${props.selectedProduct.lng}`,
                          title: props.selectedProduct.product_name,
                        }}
                        onClick={() => console.log("shared successfully!")}
                      >
                        <ShareIcon />
                      </RWebShare>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            }
          </StyledBox>
        </SwipeableDrawer>
      </Box>
    </Root>
  );
}
