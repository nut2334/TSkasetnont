import React, { useEffect } from "react";
import { TextField, MenuItem, Button, Grid, Box } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import * as config from "../config/config";

const SetDataStandard = (prop: {
  index: number;
  setStandardList: React.Dispatch<
    React.SetStateAction<
      {
        standard_id: string;
      }[]
    >
  >;
  standardList: {
    standard_id: string;
  }[];
  setSelectedStandard: React.Dispatch<
    React.SetStateAction<
      {
        standard_id: string;
        standard_name: string;
        standard_number: string;
        standard_expire: Date;
        standard_cercification: File;
      }[]
    >
  >;
  option: {
    standard_id: string;
  };
  selectStandard: {
    standard_id: string;
    standard_name: string;
    standard_number: string;
    standard_expire: Date;
    standard_cercification: File;
  }[];
  setCercificationImage: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const apiStandard = config.getApiEndpoint("standardproducts", "GET");
  const [standardData, setStandardData] = React.useState<
    [
      {
        standard_id: string;
        standard_name: string;
      }
    ]
  >([{ standard_id: "", standard_name: "" }]);
  const [standardId, setStandardId] = React.useState<string>("");
  const [standardName, setStandardName] = React.useState<string>("");
  const [standardNumber, setStandardNumber] = React.useState<string>("");
  const [standardExpire, setStandardExpire] = React.useState<Date>();
  const [standardCercification, setStandardCercification] =
    React.useState<File>();

  const handleStandardAdd = () => {
    prop.setStandardList([...prop.standardList, { standard_id: "" }]);
  };
  const handleStandardRemove = (index: number) => {
    const list = [...prop.standardList];
    list.splice(index, 1);
    prop.setStandardList(list);
  };

  useEffect(() => {
    axios.get(apiStandard).then((response) => {
      setStandardData(response.data);
    });
  }, []);

  useEffect(() => {
    const list = [...prop.selectStandard];
    if (standardExpire != undefined && standardCercification != undefined) {
      list[prop.index] = {
        standard_id: standardId,
        standard_name: standardName,
        standard_number: standardNumber,
        standard_expire: standardExpire,
        standard_cercification: standardCercification,
      };
    }
    prop.setSelectedStandard(list);
  }, [standardId, standardNumber, standardExpire, standardCercification]);

  return (
    <>
      <Grid key={prop.index} container spacing={2}>
        <Grid item xs={6}>
          <TextField select label="มาตรฐานสินค้า" fullWidth>
            {standardData.map((option, index2) => {
              if (prop.index > 0 && index2 == 0) {
                return;
              }
              return (
                <MenuItem
                  key={option.standard_id}
                  value={option.standard_name}
                  onClick={() => {
                    const list = [...prop.standardList];
                    list[prop.index] = {
                      standard_id: option.standard_id,
                    };
                    prop.setStandardList(list);
                    setStandardId(option.standard_id);
                  }}
                >
                  {option.standard_name}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
        {prop.option.standard_id != "ST000" &&
          prop.option.standard_id != "" && (
            <>
              {prop.option.standard_id == "ST008" && (
                <Grid item xs={6}>
                  <TextField
                    label="ชื่อมาตรฐานสินค้า"
                    fullWidth
                    onChange={(e) => {
                      setStandardName(e.target.value);
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <TextField
                  label="หมายเลขมาตรฐานสินค้า"
                  fullWidth
                  onChange={(e) => {
                    setStandardNumber(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <AddPhotoAlternateIcon
                    sx={{ marginRight: "5px" }}
                    color="primary"
                  />
                  ใบรับรองมาตรฐานสินค้า
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files === null) {
                      return;
                    }
                    setStandardCercification(e.target.files[0]);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">วันหมดอายุใบรับรอง</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    onChange={(e: any) =>
                      setStandardExpire(e.format("YYYY-MM-DD"))
                    }
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}
        <Grid item xs={3}>
          {prop.index != 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleStandardRemove(prop.index)}
            >
              - ลบมาตรฐานสินค้า
            </Button>
          )}
        </Grid>
        {prop.option.standard_id != "ST000" && (
          <Grid item xs={12}>
            {prop.standardList.length - 1 === prop.index && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStandardAdd}
              >
                + เพิ่มมาตรฐานสินค้า
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SetDataStandard;
