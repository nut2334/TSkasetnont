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
import { NumberInput } from "../../components/addamount";
import Navbar from "../../components/navbar";
import { NavLink } from "react-router-dom";
import Payment from "./payment";
import Swal from "sweetalert2";

const EachItem = (prop: {
  cart: Cart;
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
}) => {
  const [quantity, setQuantity] = React.useState<number>(prop.cart.quantity);
  useEffect(() => {
    prop.setCartList((prev) =>
      prev.map((cart) => {
        if (cart.product_id === prop.cart.product_id) {
          return { ...cart, quantity: quantity };
        }
        return cart;
      })
    );
  }, [quantity]);


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
          <NumberInput
            aria-label="Quantity Input"
            min={1}
            max={prop.cart.stock}
            value={quantity}
            setQuantity={setQuantity}
            quantity={quantity}
          />
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
          <Typography
            variant="h6"
            sx={{
              fontSize: "20px",
              color: "green",
            }}
          >
            ราคารวม : {prop.cart.price * quantity} บาท
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
const ListCart = (prop: { setCartList: React.Dispatch<React.SetStateAction<Cart[]>>, cartList: Cart[]; jwt_token: string }) => {
  const { cartList, setCartList } = prop;
  const [comfirmPayment, setComfirmPayment] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(cartList);

  }, [cartList]);
  useEffect(() => {
    console.log(comfirmPayment);

  }, [comfirmPayment]);

  const handleSubmit = () => {
    if (cartList.length === 0) {
      Swal.fire({
        title: "กรุณาเลือกสินค้า",
        icon: "error",
      });
      return;
    }
    setComfirmPayment(true);
  }
  return (
    <Container component="main" maxWidth="lg" sx={{ marginTop: 3 }}>
      {!comfirmPayment ? <div>
        {cartList.map((cart, index) => {
          return (
            <>
              <EachItem setCartList={setCartList} cart={cart} />
            </>
          );
        })}

        <Button
          startIcon={<PointOfSaleIcon />}
          variant="contained"
          onClick={handleSubmit}
        >
          ชำระเงิน
        </Button>
      </div>
        : <Payment setCartList={setCartList} cartList={cartList} jwt_token={prop.jwt_token} />
      }
    </Container>
  );
};

export default ListCart;
