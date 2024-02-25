import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as config from '../../config/config'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Box, Button, Chip, ListItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import AddCircle from '@mui/icons-material/AddCircle';

interface orderInterface {
    id: string;
    status: string;
    total_amount: number;
    date_buys: string;
    date_complete: string | null;
    transaction_comfirm: string | null;
    products: {
        product_id: string;
        product_name: string;
        product_image: string;
        quantity: number;
        price: number;
    }[]
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#3f51b5',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const EachOrder = (prop: { order: orderInterface, jwt_token: string }) => {
    const [open, setOpen] = React.useState(false);
    const { order } = prop
    const handleClick = () => {
        setOpen(!open);
    };
    const inputRef = useRef<HTMLInputElement>(null)

    return (<>
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={order.id} />
            <Chip label={order.status} color={`${order.status === "complete" ? "success" : "warning"}`} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {/* table */}
                <ListSubheader>รายละเอียดคำสั่งซื้อ</ListSubheader>

                <Box display={'flex'}>
                    {/* make all item flex */}
                    <ListItem
                        alignItems='flex-start'
                    >
                        <ListItemText>
                            สถาณะการชำระเงิน :&nbsp;

                            {order.transaction_comfirm ? <Chip label="ชำระเงินเสร็จสิ้น" color="success" /> : <>
                                <Chip label="ยังไม่ชำระเงิน" color="error" />

                            </>}

                        </ListItemText>
                        {!order.transaction_comfirm ?
                            <>
                                <input type="file" accept='image/*' ref={inputRef} style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files === null) {
                                            return;
                                        }
                                        let files = e.target.files[0]
                                        let apiImageUpload = config.getApiEndpoint("confirmtrancsaction", "POST")
                                        const data = new FormData();
                                        data.append('productSlip', files);
                                        data.append('order_id', order.id)

                                        axios.post(apiImageUpload, data, {
                                            headers: {
                                                'Authorization': `Bearer ${prop.jwt_token}`
                                            }
                                        }).then(() => {
                                            console.log("upload success")

                                        }).catch((err) => {
                                            console.log(err)
                                        })
                                    }}
                                />
                                <Chip icon={<AddCircle />} label="แจ้งชำระเงิน" color="info" onClick={() => {
                                    inputRef.current?.click()
                                }} />
                            </>


                            : <Chip icon={<AddCircle />} label="ดูหลักฐานการโอนเงิน" color="info" />}
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem>
                        <ListItemText
                            primary={`วันที่สั่งซื้อ: ${order.date_buys}`}
                        />
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem>
                        <ListItemText
                            primary={`วันที่สำเร็จ: ${order.date_complete ? order.date_complete : "ยังไม่สำเร็จ"}`}
                        />
                    </ListItem>

                </Box>

                <Divider />

                <ListSubheader>สินค้าทั้งหมด</ListSubheader>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>

                                <StyledTableCell>สินค้า</StyledTableCell>
                                <StyledTableCell>รายการ</StyledTableCell>
                                <StyledTableCell align="right">จำนวน</StyledTableCell>
                                <StyledTableCell align="right">ราคา</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {order.products.map((product, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell align="left">{index + 1}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {product.product_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{product.quantity}</StyledTableCell>
                                    <StyledTableCell align="right">{product.price * product.quantity} บาท</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {/* total */}
                            <StyledTableRow>
                                <StyledTableCell colSpan={4} align="right">รวมราคาทั้งหมด : {order.total_amount} บาท</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            </List>

        </Collapse>
    </>)
}


const Orderlist = (prop: { jwt_token: string }) => {
    const [orderList, setOrderList] = useState<orderInterface[]>([])

    useEffect(() => {
        const mockData = [
            {
                id: "1",
                status: "complete",
                total_amount: 600,
                date_buys: "2022-09-09",
                date_complete: "2022-09-10",
                transaction_comfirm: null,
                products: [
                    {
                        product_id: "1",
                        product_name: "apple",
                        product_image: "https://www.google.com",
                        quantity: 10,
                        price: 10
                    },
                    {
                        product_id: "2",
                        product_name: "banana",
                        product_image: "https://www.google.com",
                        quantity: 20,
                        price: 10
                    },
                    {
                        product_id: "3",
                        product_name: "orange",
                        product_image: "https://www.google.com",
                        quantity: 30,
                        price: 10
                    }
                ]
            },
            {
                id: "2",
                status: "pending",
                total_amount: 200,
                date_buys: "2022-09-09",
                date_complete: null,
                transaction_comfirm: "123456",
                products: [
                    {
                        product_id: "2",
                        product_name: "banana",
                        product_image: "https://www.google.com",
                        quantity: 20,
                        price: 10
                    }
                ]
            }
        ]
        setOrderList(mockData)
        let apiOrderList = config.getApiEndpoint("orderlist", "GET")
        axios.get(apiOrderList, {
            headers: {
                "Authorization": `Bearer ${prop.jwt_token}`
            }
        }).then((res) => {
            console.log(res.data.orders);

            // setOrderList(res.data.orders)
        }
        ).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <div>
            {orderList.map((order: any, index: number) => {
                return (
                    <EachOrder key={index} order={order} jwt_token={prop.jwt_token} />
                )

            })}
        </div>
    )
}

export default Orderlist
