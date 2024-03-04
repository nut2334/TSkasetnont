import { Container, Grid, Typography } from "@mui/material";
import React from "react";

const Analyze = (prop: { jwt_token: string }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 1,
        marginBottom: 5,
      }}
    >
      <Grid container spacing={3}>
        <Grid
          item
          xs={6}
          sx={{
            border: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="h4">ยอดขายวันนี้</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">ยอดขายเดือนนี้</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analyze;
