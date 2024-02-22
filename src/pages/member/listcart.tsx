import React, { useEffect } from "react";
import { Cart } from "../../App";
import { Button, Divider, Typography } from "@mui/material";
import { Container } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import axios from "axios";
import * as config from "../../config/config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Grid from "@mui/material/Grid";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

const ListCart = (prop: { cartList: Cart[]; jwt_token: string }) => {
  const apiCheckOut = config.getApiEndpoint("checkout", "POST");

  return (
    <Container component="main" maxWidth="lg" sx={{ marginTop: 3 }}>
      <div>
        {prop.cartList.map((cart, index) => {
          return (
            <>
              <Box
                marginBottom={2}
                sx={{
                  border: 1,
                  width: "100%",
                  padding: 2,
                  borderRadius: 3,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <Typography>{cart.product_name}</Typography>
                  </Grid>

                  <Grid item xs={1}>
                    <Typography>จำนวน {cart.amount}</Typography>
                  </Grid>
                  <Grid item xs={11}>
                    <Typography>{cart.price} บาท</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      onClick={() => {
                        console.log(cart);
                      }}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          );
        })}
        <Button
          startIcon={<PointOfSaleIcon />}
          variant="contained"
          onClick={() => {
            console.log(prop.cartList);
            axios.post(
              apiCheckOut,
              prop.cartList.map((cart) => {
                return { product_id: cart.product_id, amount: cart.amount };
              }),
              {
                headers: {
                  Authorization: `Bearer ${prop.jwt_token}`,
                },
              }
            );
          }}
        >
          ชำระเงิน
        </Button>
      </div>
    </Container>
  );
};

export default ListCart;
