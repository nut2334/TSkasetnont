import {
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Payment = () => {
  const [address, setAddress] = React.useState<string>("");
  const [checkAddress, setCheckAdress] = React.useState<boolean>(true);
  const [slip, setSlip] = React.useState<File | null>(null);

  const cliclChangeAddress = () => {
    setCheckAdress(!checkAddress);
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">ทำการสั่งซื้อ</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              disabled={checkAddress}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              label={(() => {
                return (
                  <div>
                    <FmdGoodIcon color="success" />
                    ที่อยู่สำหรับจัดส่ง
                  </div>
                );
              })()}
              value={address}
            ></TextField>
          </Grid>

          {checkAddress && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={cliclChangeAddress}
              >
                เปลี่ยนที่อยู่
              </Button>
            </Grid>
          )}

          {!checkAddress && (
            <Grid item xs={12}>
              <Button variant="contained" onClick={cliclChangeAddress}>
                ยืนยันที่อยู่
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">รายการสินค้า</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            <Typography variant="h6">ช่องทางการชำระเงิน</Typography>
            <Typography>
              กรุณาชำระเงินผ่านบัญชีธนาคาร ธ.กสิกรไทย สาขา สวนหลวง ชื่อบัญชี
              นายสมชาย ใจดี เลขที่บัญชี 123-4-56789-0
            </Typography>

            <Button
              component="label"
              variant="contained"
              color="info"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                marginTop: "10px",
              }}
            >
              อัพโหลดสลิปการโอนเงิน
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                id="upload-slip"
                name="upload-slip"
                onChange={(e) => {
                  if (e.target.files !== null) {
                    setSlip(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {slip && (
              <Typography
                sx={{
                  marginTop: "10px",
                }}
              >
                {slip.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained">ยืนยันการชำระเงิน</Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Payment;
