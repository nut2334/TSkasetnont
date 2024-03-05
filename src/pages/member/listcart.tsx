import React, { useEffect } from "react";
import { Cart } from "../../App";
import { Button, Divider, Typography, Stack } from "@mui/material";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Grid from "@mui/material/Grid";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { NumberInput } from "../../components/addamount";
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
        width: "100%",
        padding: 2,
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
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

        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              color: "green",
            }}
          >
            {prop.cart.price} บาท
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={11}>
          <Typography variant="h6" color="info">
            ราคารวม {prop.cart.price * quantity} บาท
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            onClick={() => {
              console.log(prop.cart);
              prop.setCartList((prev) =>
                prev.filter((cart) => cart.product_id !== prop.cart.product_id)
              );
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
const ListCart = (prop: {
  setCartList: React.Dispatch<React.SetStateAction<Cart[]>>;
  cartList: Cart[];
  jwt_token: string;
}) => {
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
  };
  return (
    <Container component="main" maxWidth="lg" sx={{ marginTop: 3 }}>
      {!comfirmPayment ? (
        <div>
          {cartList &&
            cartList.map((cart, index) => {
              return (
                <>
                  <EachItem setCartList={setCartList} cart={cart} />
                </>
              );
            })}
          {cartList.length > 0 && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Typography variant="h5">ยอดชำระเงินทั้งหมด </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "green",
                    }}
                  >
                    {cartList.reduce(
                      (sum, cart) => sum + cart.price * cart.quantity,
                      0
                    )}{" "}
                    บาท
                  </Typography>

                  <Button
                    startIcon={<PointOfSaleIcon />}
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ marginLeft: 2 }}
                  >
                    ชำระเงิน
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {cartList.length == 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "82vh",
                }}
              >
                <>
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Stack>
                      <img
                        src={require("../../assets/sad.png")}
                        alt="sad"
                        width="200"
                        height="200"
                      />
                    </Stack>
                    <Stack>
                      <Typography
                        variant="h4"
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        ไม่มีสินค้าในตะกร้า
                      </Typography>
                    </Stack>
                  </Stack>
                </>
              </Box>
            </>
          )}
        </div>
      ) : (
        <Payment
          setCartList={setCartList}
          cartList={cartList}
          jwt_token={prop.jwt_token}
        />
      )}
    </Container>
  );
};

export default ListCart;
