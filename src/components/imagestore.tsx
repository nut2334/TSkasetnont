import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useState, useRef } from 'react'
import * as config from '../config/config'
import axios from 'axios'
const Imagestore = (prop: { modalIsOpen: boolean, closeModal(): void, imageSelect: number, setSelectImage: React.Dispatch<React.SetStateAction<string[]>>, jwt_token: string }) => {
    const [productImage, setProductImage] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Modal
            open={prop.modalIsOpen}
            onClose={prop.closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    คลังรูปภาพ
                </Typography>
                <Button onClick={() => {
                    inputRef.current?.click()
                }}>เพิ่มรูปภาพ</Button>
                <input ref={inputRef} style={{
                    display: 'none'
                }} type="file" multiple accept="image/*" onChange={(e) => {
                    if (e.target.files === null) {
                        return;
                    }
                    let files = Array.from(e.target.files)
                    let apiImageUpload = config.getApiEndpoint("imageupload", "POST")
                    const data = new FormData();
                    files.forEach((file) => {
                        data.append('image', file);
                    });

                    axios.post(apiImageUpload, data, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${prop.jwt_token}`
                        }
                    }).then(() => {
                        let getApiImage = config.getApiEndpoint("getstoreimage", "GET")
                        axios.get(getApiImage, {
                            headers: {
                                "Authorization": `Bearer ${prop.jwt_token}`
                            }
                        }).then((res) => {
                            setProductImage(res.data)
                        }
                        ).catch((err) => {
                            console.log(err)
                        })

                    }).catch((err) => {
                        console.log(err)
                    })

                }} />
                {productImage.map((image, index) => {
                    return (
                        <img src={`${config.getApiEndpoint(
                            `getimage/${image.split("/").pop()}`,
                            "get"
                        )}`} key={index}
                            onClick={() => {

                                // ถ้ารูปภาพที่เลือกไม่อยู่ในรายการ ให้เพิ่มเข้าไป

                                if (selectedImage.indexOf(image) === -1 && selectedImage.length < prop.imageSelect) {
                                    setSelectedImage([...selectedImage, image])

                                }
                                // ถ้ารูปภาพที่เลือกอยู่ในรายการ ให้ลบออกไป
                                else if (selectedImage.indexOf(image) !== -1) {
                                    setSelectedImage(selectedImage.filter((item) => item !== image))
                                }
                            }}
                            style={{
                                border: selectedImage.indexOf(image) !== -1 ? "2px solid red" : "2px solid white",
                                width: '100px'
                            }}
                        />
                    )
                })}

                <Button onClick={() => {
                    prop.setSelectImage(selectedImage)
                    prop.closeModal()
                }}>เลือกรูปภาพ</Button>
            </Box>

        </Modal>
    )
}

export default Imagestore
