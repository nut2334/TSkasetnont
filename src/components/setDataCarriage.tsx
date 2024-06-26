import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const EachDataCarriage = (prop: {
  index: number;
  unit: string;
  dataCarriage: {
    weight: number;
    price: number;
  }[];
  data: {
    weight: number;
    price: number;
  };
  setDataCarriage: React.Dispatch<
    React.SetStateAction<
      {
        weight: number;
        price: number;
      }[]
    >
  >;
}) => {
  const [weight, setWeight] = useState<number>(
    prop.index == 0 ? 0 : prop.dataCarriage[prop.index - 1].weight + 1
  );
  const [price, setPrice] = useState<number>(0);
  const ref = React.useRef(false);
  useLayoutEffect(() => {
    //chnage by index
    if (!ref.current) return;
    let temp = JSON.parse(JSON.stringify(prop.dataCarriage));
    console.log(temp, prop.index, weight, price);
    temp[prop.index].weight = weight;
    temp[prop.index].price = price;
    prop.setDataCarriage(temp);
  }, [weight, price, ref.current]);

  // useEffect(() => {
  //   console.log(prop.dataCarriage);
  //   setWeight(prop.dataCarriage[prop.index].weight);
  //   setPrice(prop.dataCarriage[prop.index].price);
  // }, [prop.dataCarriage]);

  useEffect(() => {
    ref.current = true;
    console.log(prop.data, prop.index);

    setWeight(prop.data.weight);
    setPrice(prop.data.price);
  }, [prop.data]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={2} xs={3}>
          <TextField
            label="น้ำหนัก"
            type="number"
            inputProps={{
              min:
                prop.index == 0
                  ? 0
                  : prop.dataCarriage[prop.index - 1].weight + 1,
            }}
            value={weight}
            onChange={(e) => {
              setWeight(parseInt(e.target.value));
            }}
            InputProps={{
              endAdornment: <div>กรัม</div>,
              startAdornment: (
                <div>
                  <ArrowForwardIosIcon />
                </div>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item lg={2} xs={3}>
          <TextField
            fullWidth
            label="ค่าส่ง"
            type="number"
            inputProps={{ min: 0 }}
            value={price}
            onChange={(e) => {
              setPrice(parseInt(e.target.value));
            }}
            InputProps={{
              endAdornment: <div>บาท</div>,
            }}
          />
        </Grid>
        <Grid item lg={2}>
          {prop.index > 0 && (
            <Button
              variant="contained"
              color="error"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => {
                let temp = JSON.parse(JSON.stringify(prop.dataCarriage));
                temp.splice(prop.index, 1);
                prop.setDataCarriage(temp);
              }}
            >
              -
            </Button>
          )}
          {prop.index == prop.dataCarriage.length - 1 && price > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                prop.setDataCarriage([
                  ...prop.dataCarriage,
                  { weight: 0, price: 0 },
                ]);
              }}
            >
              +
            </Button>
          )}
        </Grid>{" "}
      </Grid>
    </>
  );
};

const SetDataCarriage = (prop: {
  unit: string;
  dataCarriage: {
    weight: number;
    price: number;
  }[];
  setDataCarriage: React.Dispatch<
    React.SetStateAction<
      {
        weight: number;
        price: number;
      }[]
    >
  >;
}) => {
  useEffect(() => {
    console.log(prop.dataCarriage);
  }, [prop.dataCarriage]);

  return (
    <>
      {prop.dataCarriage.map((data, index) => {
        return (
          <>
            <Grid item xs={12}>
              <EachDataCarriage
                unit={prop.unit}
                index={index}
                data={data}
                dataCarriage={prop.dataCarriage}
                setDataCarriage={prop.setDataCarriage}
              />
            </Grid>
          </>
        );
      })}
    </>
  );
};

export default SetDataCarriage;
