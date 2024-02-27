import React, { useState, useEffect, useRef } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

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
}
const TableBank = (prop: { products: productInterface[] }) => {
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        let total = 0;
        prop.products.forEach((product) => {
            total += product.price * product.quantity;
        });
        setTotal(total);
    }, [prop.products]);
    return (
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
                    {prop.products.map((product, index) => (
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
                        <StyledTableCell colSpan={4} align="right">รวมราคาทั้งหมด : {total} บาท</StyledTableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableBank
