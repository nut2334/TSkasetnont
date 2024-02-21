import React, { useEffect } from "react";
import { Cart } from "../../App";
import { Button, Divider, Typography } from "@mui/material";
import { Container } from "@mui/material";
import Stack from "@mui/material/Stack";
import axios from "axios";
import * as config from "../../config/config";

const ListCart = (prop: { cartList: Cart[]; jwt_token: string }) => {
  const apiCheckOut = config.getApiEndpoint("checkout", "POST");

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 3 }}>
      <div>
        {prop.cartList.map((cart, index) => {
          return (
            <>
              <Stack key={index} spacing={2} direction="row">
                <Stack>
                  <Typography>{cart.product_name}</Typography>
                </Stack>

                <Stack>
                  <Typography>จำนวน {cart.amount}</Typography>
                </Stack>
              </Stack>
              <Typography>{cart.price} บาท</Typography>
              <Divider />
            </>
          );
        })}
        <Button
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
