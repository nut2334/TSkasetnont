import Favorite from "@mui/icons-material/Favorite";
import { Chip, Typography } from "@mui/material";
import React from "react";

const Follow = (prop: {
  followList: { id: string; farmerstorename: string }[];
}) => {
  return (
    <>
      <Typography variant="h3">ร้านที่คุณติดตาม</Typography>
      {prop.followList.map((follow) => {
        return (
          <Chip
            icon={<Favorite />}
            label={follow.farmerstorename}
            variant="outlined"
          />
        );
      })}
    </>
  );
};

export default Follow;
