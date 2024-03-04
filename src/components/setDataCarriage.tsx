import React, { useEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";

const EachDataCarriage = (prop: {
  index: number;
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
  const [weight, setWeight] = useState<number>(
    prop.index == 0 ? 0 : prop.dataCarriage[prop.index - 1].weight + 1
  );
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    //chnage by index
    let temp = prop.dataCarriage;
    temp[prop.index].weight = weight;
    temp[prop.index].price = price;
    prop.setDataCarriage(temp);
  }, [weight, price]);

  useEffect(() => {
    setWeight(prop.dataCarriage[prop.index].weight);
    setPrice(prop.dataCarriage[prop.index].price);
  }, [prop.dataCarriage]);

  useEffect(() => {
    setWeight(prop.dataCarriage[prop.index].weight);
    setPrice(prop.dataCarriage[prop.index].price);
  }, []);

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
          />
        </Grid>
        <Grid item lg={2} xs={3}>
          <TextField label="หน่วย" value={prop.unit} disabled />
        </Grid>
        <Grid item lg={2} xs={3}>
          <TextField
            label="ค่าส่ง"
            type="number"
            inputProps={{ min: 0 }}
            value={price}
            onChange={(e) => {
              setPrice(parseInt(e.target.value));
            }}
          />
        </Grid>
        {prop.index > 0 && (
          <Grid item lg={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                let temp = JSON.parse(JSON.stringify(prop.dataCarriage));
                temp.splice(prop.index, 1);
                prop.setDataCarriage(temp);
              }}
            >
              ลบค่าส่ง
            </Button>
          </Grid>
        )}
        {prop.index == prop.dataCarriage.length - 1 &&
          weight > 0 &&
          price > 0 && (
            <Grid item lg={1} xs={1}>
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
            </Grid>
          )}
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
  // const [weight, setWeight] = React.useState<number>(0);
  // const [price, setPrice] = React.useState<number>(0);

  // useEffect(() => {
  //   prop.setDataCarriage([{ weight, price }]);
  // }, [weight, price]);

  // useEffect(() => {
  //   setWeight(prop.dataCarriage.weight);
  //   setPrice(prop.dataCarriage.price);
  // }, [prop.dataCarriage]);

  return (
    <>
      {prop.dataCarriage.map((data, index) => {
        return (
          <>
            <Grid item xs={12}>
              <EachDataCarriage
                unit={prop.unit}
                index={index}
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
