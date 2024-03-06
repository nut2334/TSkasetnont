import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import * as config from "../../config/config";

const Follow = (prop: {
  followList: { id: string; farmerstorename: string }[];
  jwt_token: string;
  setFollowList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        farmerstorename: string;
      }[]
    >
  >;
}) => {
  return (
    <>
      <Divider
        textAlign="left"
        sx={{
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Typography>ร้านที่ติดตาม</Typography>
      </Divider>
      <Grid container spacing={2}>
        {prop.followList.map((follow) => {
          return (
            <>
              <Grid item lg={6}>
                <Typography variant="h6">{follow.farmerstorename}</Typography>
              </Grid>
              {prop.followList[0].id === "" && (
                <Grid item lg={6}>
                  <Typography variant="h6">ไม่มีร้านที่ติดตาม</Typography>
                </Grid>
              )}

              <Grid item lg={6}>
                <Chip
                  sx={{
                    backgroundColor: "#ee4267",
                    color: "white",
                  }}
                  icon={
                    <FavoriteIcon
                      sx={{
                        fill: "white",
                      }}
                    />
                  }
                  label="ติดตาม"
                  onClick={() => {
                    Swal.fire({
                      title: "ต้องการยกเลิกติดตามหรือไม่?",
                      showDenyButton: true,
                      confirmButtonText: `ตกลง`,
                      denyButtonText: `ยกเลิก`,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        const apiFollow = config.getApiEndpoint(
                          "followfarmer",
                          "DELETE"
                        );
                        console.log("apiFollow", follow.id);

                        axios
                          .delete(apiFollow, {
                            headers: {
                              Authorization: `Bearer ${prop.jwt_token}`,
                            },
                            data: {
                              farmer_id: follow.id,
                            },
                          })
                          .then((res) => {
                            console.log("res.data", res.data);
                            prop.setFollowList(
                              prop.followList.filter((item) => {
                                return item.id !== follow.id;
                              })
                            );
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else if (result.isDenied) {
                        console.log("ยกเลิก");
                      }
                    });
                  }}
                />
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
};

export default Follow;
