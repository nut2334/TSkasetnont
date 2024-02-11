import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { NavLink } from 'react-router-dom';

interface userInterface {
    id: string,
    prefix: string,
    firstname: string,
    lastname: string,
    role: string,
}
const mockUser: userInterface[] = [
    {
        id: "1",
        prefix: "นาย",
        firstname: "สมชาย",
        lastname: "ใจดี",
        role: "farmer",
    },
    {
        id: "2",
        prefix: "นาย",
        firstname: "สมชาย",
        lastname: "ใจดี",
        role: "farmer",
    },
    {
        id: "3",
        prefix: "นาย",
        firstname: "สมชาย",
        lastname: "ใจดี",
        role: "admins",
    },
    {
        id: "4",
        prefix: "นาย",
        firstname: "สมชาย",
        lastname: "ใจดี",
        role: "farmer",
    },
    {
        id: "5",
        prefix: "นาย",
        firstname: "สมชาย",
        lastname: "ใจหมา",
        role: "farmer",
    },
    {
        id: "6",
        prefix: "นาย",
        firstname: "สมทรง",
        lastname: "ใจดี",
        role: "admins",
    },
]

const mockRole: string[] = [
    "all",
    "admins",
    "farmer",
]
const ManageUser = () => {
    const [users, setUsers] = React.useState<userInterface[]>([])
    const [filteredUsers, setFilteredUsers] = React.useState<userInterface[]>([])
    const [searchUser, setSearchUser] = React.useState<string>("")
    const [role, setRole] = useState('')


    useEffect(() => {
        fetchUsers().then((users) => {
            setUsers(users)
            setFilteredUsers(users)
        })

    }, [])

    const fetchUsers = async () => {
        return await mockUser
    }

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const deleteUser = (id: string) => {
        let body = {
            id: id
        }
        setUsers(users.filter((user) => user.id !== id))
    }

    const handleSearch = () => {
        let filteredUsers = users

        if (role !== "all" && role !== "") {
            filteredUsers = users.filter((user) => user.role == role)
        }
        if (searchUser !== "") {
            let splitedSearchUser = searchUser.trim().split(" ")
            if (splitedSearchUser.length == 1) {
                filteredUsers = filteredUsers.filter((user) => user.firstname == splitedSearchUser[0])
            }
            else if (splitedSearchUser.length == 2) {
                filteredUsers = filteredUsers.filter((user) => user.firstname == splitedSearchUser[0] && user.lastname == splitedSearchUser[1])
            }
        }
        setFilteredUsers(filteredUsers)
    }

    return (
        <Container component="main" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <h1>
                จัดการสมาชิก
            </h1>
            <div>
                <TextField id="name" label="ชื่อสมาชิก" variant="outlined"
                    onChange={(event) => setSearchUser(event.target.value as string)}
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">ตำแหน่ง</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="ตำแหน่ง"
                        onChange={handleChange}
                    >
                        {mockRole.map((role, index) => (
                            <MenuItem value={role}>{role}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <button onClick={handleSearch}>ค้นหา</button>
            </div>
            <NavLink to="/adduser" style={{ textDecoration: "none" }}>
                <button>เพิ่มสมาชิก</button>
            </NavLink>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">รหัสสมาชิก</TableCell>
                            <TableCell align="center" >คำนำหน้า</TableCell>
                            <TableCell align="center" >ชื่อ</TableCell>
                            <TableCell align="center" >นามสกุล</TableCell>
                            <TableCell align="center" >ตำแหน่ง</TableCell>
                            <TableCell align="center" >การกระทำ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.id}
                                </TableCell>
                                <TableCell align="center">{user.prefix}</TableCell>
                                <TableCell align="center">{user.firstname}</TableCell>
                                <TableCell align="center">{user.lastname}</TableCell>
                                <TableCell align="center">{user.role}</TableCell>
                                <TableCell align="center">

                                    <button onClick={() => deleteUser(user.id)}>ลบ</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default ManageUser
