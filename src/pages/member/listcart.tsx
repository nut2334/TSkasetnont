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
import { QuantityInput } from "../../components/addamount";
import Navbar from "../../components/navbar";
import { NavLink } from "react-router-dom";

const EachItem = (prop: {
  cart: Cart;
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
}) => {
  const [amount, setAmount] = React.useState<number>(prop.cart.amount);

  useEffect(() => {
    prop.setCartList((prev) =>
      prev.map((cart) => {
        if (cart.product_id === prop.cart.product_id) {
          return { ...cart, amount: amount };
        }
        return cart;
      })
    );
  }, [amount]);

  return (
    <Box
      marginBottom={2}
      sx={{
        borderRadius: 2,
        width: "100%",
        padding: 2,
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Typography variant="h5">{prop.cart.product_name}</Typography>
        </Grid>
        <Grid item xs={3}>
          {QuantityInput({
            stock: prop.cart.stock,
            setAmount: setAmount,
            amount: amount,
          })}
        </Grid>

        <Grid item xs={11}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "20px",
              color: "green",
            }}
          >
            {prop.cart.price} บาท
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            onClick={() => {
              console.log(prop.cart);
            }}
            color="error"
          >
            <DeleteForeverIcon />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
const ListCart = (prop: { cartList: Cart[]; jwt_token: string }) => {
  const apiCheckOut = config.getApiEndpoint("checkout", "POST");
  const [cartList, setCartList] = React.useState<Cart[]>(
    prop.cartList.map((cart) => {
      return cart;
    })
  );
  return (
    <Container component="main" maxWidth="lg" sx={{ marginTop: 3 }}>
      <div>
        {cartList.map((cart, index) => {
          return (
            <>
              <EachItem setCartList={setCartList} cart={cart} />
            </>
          );
        })}
        <NavLink to="/payment">
          <Button
            startIcon={<PointOfSaleIcon />}
            variant="contained"
            onClick={() => {
              console.log(prop.cartList);
              axios.post(
                apiCheckOut,
                {
                  cartList: prop.cartList.map((cart) => {
                    return { product_id: cart.product_id, amount: cart.amount };
                  }),
                },
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
        </NavLink>
      </div>
    </Container>
  );
};

export default ListCart;
