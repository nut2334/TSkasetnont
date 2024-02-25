import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, MenuItem, Button, Grid, Box } from "@mui/material";
import * as config from "../config/config";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from 'dayjs';
import Imagestore from "./imagestore";


const EachCertificate = (prop: {
  item: {
    standard_id: string;
    standard_name: string;
    standard_number: string;
    standard_expire: Date | undefined;
    standard_cercification: string | undefined;
  }, index: number, allStandard: {
    standard_id: string;
    standard_name: string;
  }[], setSelectedStandard: React.Dispatch<
    React.SetStateAction<
      {
        standard_id: string;
        standard_name: string;
        standard_number: string;
        standard_expire: Date | undefined;
        standard_cercification: string | undefined;
      }[]
    >
  >,
  selectedStandard: {
    standard_id: string;
    standard_name: string;
    standard_number: string;
    standard_expire: Date | undefined;
    standard_cercification: string | undefined;
  }[], setIsOpen: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    imageSelect: number;
    setStateImage: React.Dispatch<React.SetStateAction<string[]>>;
  } | null | undefined>>
}) => {
  let { item, index, allStandard, setIsOpen } = prop;
  const [certificate, setCertificate] = useState<string[]>([]);
  let date = item.standard_expire ? dayjs(item.standard_expire) : null;

  useEffect(() => {
    if (item.standard_cercification) {
      setCertificate([item.standard_cercification]);
    }
  }, [item.standard_cercification])

  useEffect(() => {
    if (certificate) {
      const list = [...prop.selectedStandard];
      list[index].standard_cercification = certificate[0];
      prop.setSelectedStandard(list);
    }
  }, [certificate]);
  return (
    <>
      <TextField value={item.standard_id} select label="มาตรฐานสินค้า" fullWidth>
        {allStandard && allStandard.map((option, index2) => {
          if (index > 0 && index2 == 0) {
            return;
          }
          return (
            <MenuItem
              key={option.standard_id}
              value={option.standard_id}
              onClick={() => {
                const list = [...prop.selectedStandard];
                list[index] = {
                  standard_id: option.standard_id,
                  standard_name: option.standard_name,
                  standard_number: "",
                  standard_expire: undefined,
                  standard_cercification: undefined,
                };
                prop.setSelectedStandard(list);
              }}
            >
              {option.standard_name}
            </MenuItem>
          );
        })}
      </TextField>
      {item.standard_id != "ST000" &&
        item.standard_id != "" && (
          <>
            {item.standard_id == "ST008" && (
              <Grid item xs={6}>
                <TextField
                  label="ชื่อมาตรฐานสินค้า"
                  fullWidth
                  value={item.standard_name}
                  onChange={(e) => {

                  }}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                label="หมายเลขมาตรฐานสินค้า"
                fullWidth
                value={item.standard_number}
                onChange={(e) => {
                  const list = [...prop.selectedStandard];
                  list[index].standard_number = e.target.value;
                  prop.setSelectedStandard(list);
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
              <Button
                onClick={() => {
                  setIsOpen({
                    isOpen: true,
                    imageSelect: 1,
                    setStateImage: setCertificate,
                  });
                }}
                variant="contained"
              >
                เลือกรูปภาพ
              </Button>
              {certificate.length > 0 && (
                <Box>
                  <img src={`${config.getApiEndpoint(
                    `getimage/${certificate[0].split("/").pop()}`,
                    "get"
                  )}`} style={{ width: "100px" }} />
                </Box>)}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">วันหมดอายุใบรับรอง</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  sx={{ width: "100%" }}
                  onChange={(e: any) => {


                    const list = [...prop.selectedStandard];
                    list[index].standard_expire = e.format("YYYY-MM-DD");
                    prop.setSelectedStandard(list);
                  }

                  }
                />
              </LocalizationProvider>
            </Grid>
          </>
        )}
      <Grid item xs={3}>
        {index != 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              const list = [...prop.selectedStandard];
              list.splice(index, 1);
              prop.setSelectedStandard(list);

            }}
          >
            - ลบมาตรฐานสินค้า
          </Button>
        )}
      </Grid>
    </>
    // <SetDataStandard
    //   index={index}
    //   setStandardList={setStandardList}
    //   standardList={standardList}
    //   setSelectedStandard={prop.setSelectedStandard}
    //   option={item}
    //   selectStandard={prop.selectedStandard}
    // />
  )
}
const AddStandard = (prop: {
  jwt_token: string,
  setSelectedStandard: React.Dispatch<
    React.SetStateAction<
      {
        standard_id: string;
        standard_name: string;
        standard_number: string;
        standard_expire: Date | undefined;
        standard_cercification: string | undefined;
      }[]
    >
  >;
  selectedStandard: {
    standard_id: string;
    standard_name: string;
    standard_number: string;
    standard_expire: Date | undefined;
    standard_cercification: string | undefined;
  }[];
}) => {

  const [allStandard, setAllStandard] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >();
  const [modalIsOpen, setIsOpen] = React.useState<{
    isOpen: boolean;
    imageSelect: number;
    setStateImage: React.Dispatch<React.SetStateAction<string[]>>;
  } | null>();
  function closeModal() {
    setIsOpen(null);
  }
  useEffect(() => {
    const apiStandard = config.getApiEndpoint("standardproducts", "GET");

    axios.get(apiStandard).then((res) => {
      setAllStandard(res.data);
    });
  }, []);

  useEffect(() => {
    console.log(prop.selectedStandard);

    if (prop.selectedStandard.length === 0) {
      prop.setSelectedStandard([
        {
          standard_id: "",
          standard_name: "",
          standard_number: "",
          standard_expire: undefined,
          standard_cercification: undefined,
        },
      ]);
    }
  }, [prop.selectedStandard]);

  return (
    <React.Fragment>
      {prop.selectedStandard.map((item, index) => {
        return <EachCertificate key={index} item={item} index={index} allStandard={allStandard ? allStandard : []} setSelectedStandard={prop.setSelectedStandard} selectedStandard={prop.selectedStandard} setIsOpen={setIsOpen} />
      })}
      {prop.selectedStandard.length > 0 && (prop.selectedStandard[0].standard_id !== "" && prop.selectedStandard[0].standard_id !== "ST000") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            prop.setSelectedStandard([...prop.selectedStandard, { standard_id: "", standard_name: "", standard_number: "", standard_expire: undefined, standard_cercification: undefined }
            ]);
          }}
        >
          + เพิ่มมาตรฐานสินค้า
        </Button>


      )}
      {modalIsOpen && (
        <Imagestore
          modalIsOpen={modalIsOpen.isOpen}
          closeModal={closeModal}
          imageSelect={modalIsOpen.imageSelect}
          setSelectImage={modalIsOpen.setStateImage}
          jwt_token={prop.jwt_token}
        />
      )}
    </React.Fragment>
  );
};

export default AddStandard;
