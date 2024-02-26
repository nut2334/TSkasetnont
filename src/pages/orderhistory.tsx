import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as config from '../config/config'
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
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
interface OrderHistoryInterface {
    order_id: string;
    products: productInterface[],
    tracking_number: string,
    customer_info: {
        member_id: string,
        firstname: string,
        lastname: string,
        phone: string,
        address: string,
    }
    date_buys: string,
    date_complete: string | null,
    total_amount: number,
    transaction_confirm: string,
    status: string
}
interface productInterface {
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
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

const EachOrder = (prop: { order: OrderHistoryInterface, jwt_token: string, fetchOrderHistory: () => void }) => {
    const [open, setOpen] = React.useState(false);
    const [trackingNumber, setTrackingNumber] = useState<string>("")
    const { order } = prop
    const handleClick = () => {
        setOpen(!open);
    };
    const [showTransaction, setShowTransaction] = useState(false)
    const [showTrackingNumber, setShowTrackingNumber] = useState(false)
    const showSweet = () => {
        withReactContent(Swal).fire({
            title: <i>เหตุผลการปฎิเสธ</i>,
            input: "text",
            showDenyButton: true,
            denyButtonText: "ยกเลิก",
            confirmButtonText: "บันทึก",
            preConfirm: () => {
                // setId(Swal.getInput()?.value || "");
                handleSubmit(Swal.getInput()?.value || "");
            },
        });
    }

    const handleSubmit = (comment: string) => {
        let apiConfirmOrder = config.getApiEndpoint("confirmorder", "POST")
        axios.post(apiConfirmOrder, {
            order_id: order.order_id,
            status: "reject",
            comment: comment

        }, {
            headers: {
                "Authorization": `Bearer ${prop.jwt_token}`
            }
        }).then((res) => {
            prop.fetchOrderHistory()
            setShowTransaction(false)
        }
        ).catch((err) => {
            console.log(err)
        })
    }

    return (<>
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={order.order_id} />
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
                            สถาณะคำสั่งซื้อ :&nbsp;
                            {order.status === "complete" ? <Chip label="สำเร็จ" color="success" />
                                : order.status === "waiting" ? <Chip label="รอจัดส่ง" color="warning" />
                                    : order.status === "pending" ? <Chip label="รอการตรวจสอบ" color="info" />
                                        : <Chip label="ยกเลิก" color="error" />}

                        </ListItemText>
                        {
                            order.status === "complete" ? <ListItemText>เลขพัสดุ : {order.tracking_number}</ListItemText> :
                                order.status === "pending" ?
                                    <Chip icon={<AddCircle />} label="ตรวจสอบหลักฐาน" color="info"
                                        onClick={() => {
                                            setShowTransaction(!showTransaction)
                                        }}
                                    /> : order.status === "waiting" ? <Chip icon={<AddCircle />} label="ยืนยันการจัดส่ง" color="info"
                                        onClick={() => {
                                            setShowTrackingNumber(!showTrackingNumber)
                                        }}
                                    /> : null
                        }
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
                {showTransaction &&
                    <>
                        <Divider />
                        <ListItem
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <img src={`${config.getApiEndpoint(
                                `getimage/${order.transaction_confirm.split("/").pop()}`,
                                "get"
                            )}`} alt="transaction" style={{ height: "500px" }} />
                        </ListItem>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                let apiConfirmOrder = config.getApiEndpoint("confirmorder", "POST")
                                axios.post(apiConfirmOrder, {
                                    order_id: order.order_id,
                                    status: "waiting"
                                }, {
                                    headers: {
                                        "Authorization": `Bearer ${prop.jwt_token}`
                                    }
                                }).then((res) => {
                                    prop.fetchOrderHistory()
                                    setShowTransaction(false)
                                }
                                ).catch((err) => {
                                    console.log(err)
                                })
                            }}
                        >ยอมรับหลักฐานการจ่ายเงิน</Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                showSweet()
                            }}
                        >ปฏิเสธ</Button>
                    </>

                }
                {showTrackingNumber &&
                    <>
                        <Divider />
                        <ListItem
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <input type="text" value={trackingNumber} onChange={(e) => { setTrackingNumber(e.target.value) }} />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    let apiConfirmOrder = config.getApiEndpoint("confirmorder", "POST")
                                    axios.post(apiConfirmOrder, {
                                        order_id: order.order_id,
                                        status: "complete",
                                        tracking_number: trackingNumber
                                    }, {
                                        headers: {
                                            "Authorization": `Bearer ${prop.jwt_token}`
                                        }
                                    }).then((res) => {
                                        prop.fetchOrderHistory()
                                        setShowTrackingNumber(false)
                                    }
                                    ).catch((err) => {
                                        console.log(err)
                                    })
                                }}
                            >ยืนยัน</Button>
                        </ListItem>
                    </>
                }
                <Divider />
                <ListSubheader>รายละเอียดผู้ซื้อ</ListSubheader>
                <Box display={'flex'}>
                    <ListItem
                    >
                        <ListItemText>
                            ชื่อ : {order.customer_info.firstname} {order.customer_info.lastname}
                        </ListItemText>
                        <ListItemText>
                            เบอร์โทร : {order.customer_info.phone}
                        </ListItemText>
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem>
                        <ListItemText>
                            ที่อยู่ : {order.customer_info.address}
                        </ListItemText>
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


const Orderhistory = (prop: { jwt_token: string }) => {
    const [orderHistory, setOrderHistory] = useState<OrderHistoryInterface[]>([])
    const fetchOrderHistory = () => {
        let apiOrderHistory = config.getApiEndpoint("farmerorder", "GET")
        axios.get(apiOrderHistory, {
            headers: {
                "Authorization": `Bearer ${prop.jwt_token}`
            }
        }).then((res) => {
            console.log(res.data);

            setOrderHistory(res.data)
        }
        ).catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        fetchOrderHistory()
    }, [])
    return (

        <div>
            {orderHistory.map((order, index) => {
                return (
                    <EachOrder key={index} order={order} jwt_token={prop.jwt_token} fetchOrderHistory={fetchOrderHistory} />
                )
            })}
        </div>
    )
}

export default Orderhistory
