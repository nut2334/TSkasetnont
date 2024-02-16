import React, { useEffect } from "react";
import { Button, Grid, TextField } from "@mui/material";

const SetDataCarriage = (prop: {
  index: number;
  unit: string;
  setCarriageList: React.Dispatch<
    React.SetStateAction<
      {
        weight: number;
      }[]
    >
  >;
  setDataCarriage: React.Dispatch<
    React.SetStateAction<
      {
        weight: number;
        price: number;
      }[]
    >
  >;
}) => {
  const [weight, setWeight] = React.useState<number>(0);
  const [price, setPrice] = React.useState<number>(0);

  useEffect(() => {
    prop.setDataCarriage((prev) => {
      const newState = [...prev];
      newState[prop.index] = { weight, price };
      return newState;
    });
  }, [weight, price]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            label="น้ำหนัก"
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField label="หน่วย" value={prop.unit} disabled />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="ค่าส่ง"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              prop.setCarriageList((prev) => {
                const newState = [...prev];
                newState.push({ weight: 0 });
                return newState;
              });
            }}
          >
            +
          </Button>
        </Grid>
        {prop.index !== 0 && (
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                prop.setCarriageList((prev) => {
                  const newState = [...prev];
                  newState.splice(prop.index, 1);
                  return newState;
                });
              }}
            >
              -
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SetDataCarriage;
