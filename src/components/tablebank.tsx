import React, { useState, useEffect, useRef } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as config from '../config/config';
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
interface productInterface {
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    comment?: {
        rating: number;
        date_comment: string;
        comment: string;
    };
}

const GenerateStart = (prop: {
    index2: number, product: productInterface, haveComment: {
        jwt_token: string, order_id: string, fecthOrder: () => void
    }, callSwl: (index: number, rating: number, product_id: string, order_id: string, jwt_token: string) => void

}) => {
    const [hoverScore, setHoverScore] = useState<number>(0);
    const { haveComment, product, callSwl, index2 } = prop;

    return (
        <StyledTableCell align="right">
            {Array(5).fill(0).map((_, index) => {
                if (product.comment === null || product.comment === undefined) {
                    if (index < hoverScore) {
                        return (<StarIcon sx={{
                            color: "#ffd700",
                            cursor: "pointer"
                        }} key={index}
                            onMouseOver={() => {
                                setHoverScore(index + 1);
                            }}
                            onMouseOutCapture={() => {
                                setHoverScore(0);
                            }}
                            onClick={() => {
                                callSwl(index2, index + 1, product.product_id, haveComment.order_id, haveComment.jwt_token)
                            }}
                        />)
                    }
                    return (<StarBorderIcon
                        key={index}
                        onMouseOver={() => {
                            setHoverScore(index + 1);
                        }}
                        onClick={() => {
                            callSwl(index2, index + 1, product.product_id, haveComment.order_id, haveComment.jwt_token)
                        }}
                    />)
                }
                return index < product.comment.rating ? (<StarIcon sx={{
                    color: "#ffd700",
                }} key={index} />) : (<StarBorderIcon key={index} />)

            }
            )
            }

        </StyledTableCell>
    )
}

const TableBank = (prop: {
    products: productInterface[], haveComment?: {
        jwt_token: string, order_id: string, fecthOrder: () => void
    }
}) => {
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        let total = 0;
        console.log(prop.products);

        prop.products.forEach((product) => {
            total += product.price * product.quantity;
        });
        setTotal(total);
    }, [prop.products]);

    const callSwl = (index: number, rating: number, product_id: string, order_id: string, jwt_token: string) => {
        Swal.fire({
            title: 'ความคิดเห็น',
            input: 'textarea',
            showCancelButton: true,
            inputPlaceholder: 'กรุณาใส่ความคิดเห็น(ถ้ามี)',
        }).then((result) => {
            if (result.isDismissed) {
                return;
            }
            let apiComment = config.getApiEndpoint('comment', 'GET')
            let body = {
                product_id: product_id,
                order_id: order_id,
                rating: rating,
                comment: result.value ? result.value : ""
            }
            axios.post(apiComment, body, {
                headers: {
                    "Authorization": `Bearer ${jwt_token}`
                }
            }).then((res) => {
                console.log(res);
                Swal.fire({
                    icon: 'success',
                    title: 'เพิ่มความคิดเห็นสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                })
                prop.haveComment?.fecthOrder()

            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'เพิ่มความคิดเห็นไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                })
            })


        })
    }
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <StyledTableRow>

                        <StyledTableCell>สินค้า</StyledTableCell>
                        <StyledTableCell>รายการ</StyledTableCell>
                        <StyledTableCell align="right">จำนวน</StyledTableCell>
                        <StyledTableCell align="right">ราคา</StyledTableCell>
                        {prop.haveComment && <StyledTableCell align="right">ความคิดเห็น</StyledTableCell>}


                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {prop.products.map((product, index2) => (
                        <StyledTableRow key={index2}>
                            <StyledTableCell align="left">{index2 + 1}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {product.product_name}
                            </StyledTableCell>
                            <StyledTableCell align="right">{product.quantity}</StyledTableCell>
                            <StyledTableCell align="right">{product.price * product.quantity} บาท</StyledTableCell>
                            {prop.haveComment && <GenerateStart callSwl={callSwl} haveComment={prop.haveComment} product={product} index2={index2} />}

                        </StyledTableRow>
                    ))}
                    {/* total */}
                    <StyledTableRow>
                        <StyledTableCell colSpan={prop.haveComment ? 5 : 4} align="right">รวมราคาทั้งหมด : {total} บาท</StyledTableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableBank
