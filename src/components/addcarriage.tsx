import { Grid, TextField, InputAdornment, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState } from "react";
import SetDataCarriage from "./setDataCarriage";

const AddCarriage = (prop: {
  unit: string;
  setShippingCost: React.Dispatch<
    React.SetStateAction<
      {
        weight: number;
        price: number;
      }[]
    >
  >;
}) => {
  const [carriageList, setCarriageList] = useState<{ weight: number }[]>([
    { weight: 0 },
  ]);

  return (
    <>
      {carriageList.map((cost, index) => (
        <>
          <Grid item xs={12}>
            {/* <SetDataCarriage
              index={index}
              setCarriageList={setCarriageList}
              unit={prop.unit}
              setDataCarriage={prop.setShippingCost}
            /> */}
          </Grid>
        </>
      ))}
    </>
  );
};

export default AddCarriage;
