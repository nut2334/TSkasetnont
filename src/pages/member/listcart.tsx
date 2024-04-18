import React, { useEffect, useState } from "react";
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
  shippingcost: {
    weight: number;
    id: string;
  }[];
  setshippingcost: React.Dispatch<
    React.SetStateAction<{ weight: number; id: string }[]>
  >;
}) => {
  const [quantity, setQuantity] = React.useState<number>(prop.cart.quantity);
  const [totalWeight, setTotalWeight] = React.useState<number>(0);

  useEffect(() => {
    prop.setCartList((prev) =>
      prev.map((cart) => {
        if (cart.product_id === prop.cart.product_id) {
          return { ...cart, quantity: quantity };
        }
        return cart;
      })
    );
    setTotalWeight(prop.cart.weight * quantity);
  }, [quantity]);

  useEffect(() => {
    if (totalWeight > 0) {
      if (prop.shippingcost.length == 0) {
        prop.setshippingcost([
          { weight: totalWeight, id: prop.cart.product_id },
        ]);
        return;
      }
      const index = prop.shippingcost.findIndex(
        (shipping) => shipping.id === prop.cart.product_id
      );
      if (index === -1) {
        prop.setshippingcost((prev) => [
          ...prev,
          { weight: totalWeight, id: prop.cart.product_id },
        ]);
      } else {
        prop.setshippingcost((prev) =>
          prev.map((shipping) => {
            if (shipping.id === prop.cart.product_id) {
              return { ...shipping, weight: totalWeight };
            }
            return shipping;
          })
        );
      }
    }
  }, [totalWeight]);

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
            {totalWeight > 0 && ` น้ำหนัก ${totalWeight} กรัม`}
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
  const [shippingcost, setshippingcost] = useState<
    {
      weight: number;
      id: string;
    }[]
  >([]);
  const [summaryShippingCost, setSummaryShippingCost] = useState<number>(0);
  console.log(prop.cartList);

  useEffect(() => {
    console.log(shippingcost);
    if (shippingcost.length === 0) {
      return;
    }
    let cost: {
      weight: number;
      price: number;
    }[] = JSON.parse(prop.cartList[0].shippingcost);
    let totalWeight = shippingcost.reduce(
      (sum, shipping) => sum + shipping.weight,
      0
    );
    let totalCost = 0;
    cost.forEach((c) => {
      if (totalWeight >= c.weight) {
        totalCost = c.price;
        return;
      }
    });
    setSummaryShippingCost(totalCost);
  }, [shippingcost]);

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
                  <EachItem
                    setCartList={setCartList}
                    cart={cart}
                    shippingcost={shippingcost}
                    setshippingcost={setshippingcost}
                  />
                </>
              );
            })}
          {cartList.length > 0 && (
            <>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Typography>
                    ราคาสินค้าทั้งหมด{" "}
                    {cartList.reduce(
                      (sum, cart) => sum + cart.price * cart.quantity,
                      0
                    )}{" "}
                    บาท
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Typography>ค่าจัดส่ง {summaryShippingCost} บาท</Typography>
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
                    ) + summaryShippingCost}{" "}
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
                          color: "gray",
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
          shippingcost={summaryShippingCost}
          setCartList={setCartList}
          cartList={cartList}
          jwt_token={prop.jwt_token}
        />
      )}
    </Container>
  );
};

export default ListCart;
