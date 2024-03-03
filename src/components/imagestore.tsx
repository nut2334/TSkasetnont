import { Box, Button, Divider, Grid, Modal, Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import * as config from "../config/config";
import axios from "axios";
import { ImageList, ImageListItem } from "@mui/material";

const Imagestore = (prop: {
  modalIsOpen: boolean;
  closeModal(): void;
  imgType: "image" | "video";
  imageSelect: number;
  selectImage: string[];
  setSelectImage: React.Dispatch<React.SetStateAction<string[]>>;
  jwt_token: string;
}) => {
  const [productImage, setProductImage] = useState<string[]>([]);
  const [productVideo, setProductVideo] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>(
    prop.selectImage
  );
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let getApiImage = config.getApiEndpoint("imagestore", "GET");
    axios
      .get(getApiImage, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((res) => {
        setProductImage(res.data.images);
        setProductVideo(res.data.videos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Modal
      open={prop.modalIsOpen}
      onClose={prop.closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        {}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              คลังรูปภาพ
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              เพิ่มรูปภาพลงในคลัง
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} marginTop={2}>
          <Divider />
        </Grid>
        {productImage.length > 0 && (
          <Grid item xs={12} marginTop={2}>
            <Typography>กดเพื่อเลือกรูปภาพ</Typography>
          </Grid>
        )}
        <Grid item xs={12} marginTop={2}>
          <ImageList
            sx={{ width: "100%", height: 450 }}
            cols={3}
            rowHeight={164}
          >
            {prop.imgType == "video" &&
              productVideo.map((videopath, index) => {
                return (
                  <ImageListItem
                    key={index}
                    style={{
                      border:
                        selectedImage.indexOf(videopath) !== -1
                          ? "2px solid red"
                          : "2px solid white",
                    }}
                    onClick={() => {
                      // ถ้ารูปภาพที่เลือกไม่อยู่ในรายการ ให้เพิ่มเข้าไป
                      if (
                        selectedImage.indexOf(videopath) === -1 &&
                        selectedImage.length < prop.imageSelect
                      ) {
                        setSelectedImage([...selectedImage, videopath]);
                      }
                      // ถ้ารูปภาพที่เลือกอยู่ในรายการ ให้ลบออกไป
                      else if (selectedImage.indexOf(videopath) !== -1) {
                        setSelectedImage(
                          selectedImage.filter((item) => item !== videopath)
                        );
                      }
                    }}
                  >
                    <video
                      src={`${config.getApiEndpoint(
                        `getimage/${videopath.split("/").pop()}`,
                        "get"
                      )}`}
                      key={index}
                    />
                  </ImageListItem>
                );
              })}
            {prop.imgType == "image" &&
              productImage.map((imagepath, index) => {
                return (
                  <ImageListItem
                    key={index}
                    sx={{
                      border:
                        selectedImage.indexOf(imagepath) !== -1
                          ? "2px solid red"
                          : "2px solid white",
                    }}
                    onClick={() => {
                      // ถ้ารูปภาพที่เลือกไม่อยู่ในรายการ ให้เพิ่มเข้าไป
                      if (
                        selectedImage.indexOf(imagepath) === -1 &&
                        selectedImage.length < prop.imageSelect
                      ) {
                        setSelectedImage([...selectedImage, imagepath]);
                      }

                      // ถ้ารูปภาพที่เลือกอยู่ในรายการ ให้ลบออกไป
                      else if (selectedImage.indexOf(imagepath) !== -1) {
                        setSelectedImage(
                          selectedImage.filter((item) => item !== imagepath)
                        );
                      }
                    }}
                  >
                    <img
                      src={`${config.getApiEndpoint(
                        `getimage/${imagepath.split("/").pop()}`,
                        "get"
                      )}`}
                      key={index}
                      style={{
                        width: 164,
                        aspectRatio: 1 / 1,
                        // borderRadius: "25px",
                      }}
                    />
                  </ImageListItem>
                );
              })}
          </ImageList>
        </Grid>

        <input
          ref={inputRef}
          style={{
            display: "none",
          }}
          type="file"
          multiple
          accept={prop.imgType == "video" ? "video/*" : "image/*"}
          onChange={(e) => {
            if (e.target.files === null) {
              return;
            }
            let files = Array.from(e.target.files);
            let apiImageUpload = config.getApiEndpoint("imageupload", "POST");
            const data = new FormData();
            files.forEach((file) => {
              data.append("image", file);
            });

            axios
              .post(apiImageUpload, data, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${prop.jwt_token}`,
                },
              })
              .then(() => {
                let getApiImage = config.getApiEndpoint("imagestore", "GET");
                axios
                  .get(getApiImage, {
                    headers: {
                      Authorization: `Bearer ${prop.jwt_token}`,
                    },
                  })
                  .then((res) => {
                    setProductImage(res.data.images);
                    setProductVideo(res.data.videos);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />
        <Grid item xs={12} marginTop={2}>
          <Divider />
        </Grid>
        <Grid item xs={12} marginTop={2}>
          <Button
            variant="contained"
            onClick={() => {
              prop.setSelectImage(selectedImage);
              prop.closeModal();
            }}
          >
            ยืนยัน
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default Imagestore;
