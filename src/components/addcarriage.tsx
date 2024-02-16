import { Grid, TextField, InputAdornment, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState } from "react";

const AddCarriage = () => {
  const [carriageList, setCarriageList] = useState<
    {
      price: number;
      unit: string;
      stock: number;
      weight: number;
      shippingCost: number;
    }[]
  >([
    {
      price: 0,
      unit: "",
      stock: 0,
      weight: 0,
      shippingCost: 0,
    },
  ]);

  return (
    <>
      {/* <Grid item xs={4}>
        <TextField
          id="outlined-basic"
          label="ราคา"
          variant="outlined"
          onChange={(e) => setPrice(parseInt(e.target.value))}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="outlined-basic"
          label="หน่วย"
          variant="outlined"
          fullWidth
          onChange={(e) => setUnit(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="outlined-basic"
          label="จำนวนคลังสินค้า"
          variant="outlined"
          fullWidth
          onChange={(e) => setStock(parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={2}>
        <TextField
          id="outlined-disabled"
          label="กรัม"
          variant="outlined"
          fullWidth
          defaultValue={0}
          disabled
          onChange={(e) => setWeight(parseInt(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ArrowForwardIosIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="outlined-basic"
          label="หน่วย"
          variant="outlined"
          fullWidth
          disabled
          value={unit}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="outlined-basic"
          label="ค่าส่ง"
          variant="outlined"
          fullWidth
          onChange={(e) => setShippingCost(parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={addShippingCost}>
          +
        </Button>
      </Grid>
      <Grid item xs={5}></Grid> */}
      {/* {carriageList.map((cost, index) => (
      <React.Fragment>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="กรัม"
            variant="outlined"
            fullWidth
            key={index}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ArrowForwardIosIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="หน่วย"
            variant="outlined"
            fullWidth
            value={unit}
            key={index}
            disabled
            onChange={(e) => {
              const updatedCost = [...shippingCostList];
              updatedCost[index].unit = e.target.value;
              setShippingCostList(updatedCost);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="ค่าส่ง"
            variant="outlined"
            fullWidth
            value={cost.price}
            key={index}
            onChange={(e) => {
              const updatedCost = [...shippingCostList];
              updatedCost[index].price = parseInt(e.target.value);
              setShippingCostList(updatedCost);
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" onClick={deleteShippingCost}>
            -
          </Button>
        </Grid>
        <Grid item xs={5}></Grid>
      </React.Fragment>
    ))}*/}
      {carriageList.map((cost, index) => (
        <>
          <TextField label="น้ำหนัก" type="number" />
          <TextField label="หน่วย" defaultValue="" />
          <TextField label="ค่าส่ง" type="number" />
        </>
      ))}
    </>
  );
};

export default AddCarriage;
