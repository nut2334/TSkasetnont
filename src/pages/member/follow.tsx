import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";

const Follow = (prop: {
  followList: { id: string; farmerstorename: string }[];
}) => {
  useEffect(() => {
    console.log(prop.followList);
  }, [prop.followList]);
  return (
    <>
      <Divider
        textAlign="left"
        sx={{
          marginTop: 2,
        }}
      >
        <Typography>ร้านที่ติดตาม</Typography>
      </Divider>
      <Grid container spacing={2}>
        {prop.followList.map((follow) => {
          return (
            <>
              <Grid item lg={6}>
                <Typography>{follow.farmerstorename}</Typography>
              </Grid>

              <Grid item lg={6}>
                <Chip sx={{}} icon={<FavoriteIcon />} label="ติดตาม" />
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
};

export default Follow;
