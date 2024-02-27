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
import { Container } from "@mui/material";

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
      product_price: string;
      product_image: string;
      category_id: string;
      lat: string;
      lng: string;
    };
  }
) {
  const { window } = props;
  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const toggleDrawer = (newOpen: boolean) => () => {
    props.setOpen(newOpen);
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
              {props.selectedProduct.product_name}
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
              <Container
                maxWidth="lg"
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  top: "10%",
                  left: "20%",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    borderRadius: "100px",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "white",
                    paddingLeft: "10px",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                  }}
                >
                  <img
                    src={props.selectedProduct.product_image}
                    alt={props.selectedProduct.product_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "100px",
                    }}
                  />
                </div>
                <Typography
                  variant="h5"
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  {props.selectedProduct.product_name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  {props.selectedProduct.product_description}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  ราคา {props.selectedProduct.product_price} บาท
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  เยี่ยมชมสินค้า
                </Button>
              </Container>
            }
          </StyledBox>
        </SwipeableDrawer>
      </Box>
    </Root>
  );
}
