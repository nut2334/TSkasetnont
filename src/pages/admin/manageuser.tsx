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
import * as config from '../../config/config'
import axios from 'axios';
import EditProfile from '../editprofile';
interface userInterface {
    id: string,
    email: string,
    username: string,
    firstname: string,
    lastname: string,
    phone: string,
    role: string,
}

const allRole: string[] = [
    "all",
    "admins",
    "farmers",
    "members",
    "providers",
    "tambons"
]
const ManageUser = (prop: { jwt_token: string }) => {
    const [users, setUsers] = React.useState<userInterface[]>([])
    const [filteredUsers, setFilteredUsers] = React.useState<userInterface[]>([])
    const [searchUser, setSearchUser] = React.useState<string>("")
    const [role, setRole] = useState('')
    const [editingUser, setEditingUser] = useState<{ username: string, role: string }>()


    useEffect(() => {
        const apiFetchUsers = config.getApiEndpoint("users", "GET");

        axios.get(apiFetchUsers,
            {
                headers: {
                    Authorization: `Bearer ${prop.jwt_token}`
                }
            }
        ).then((response: any) => {
            setUsers(response.data)
            setFilteredUsers(response.data)
        });

    }, [])


    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const deleteUser = (username: string, role: string) => {
        let body = {
            id: username
        }
        setUsers(users.filter((user) => user.id !== username))
    }

    const editUser = (username: string, role: string) => {
        setEditingUser({ username, role })
    }
    const handleSearch = () => {
        let filteredUsers = users

        if (role !== "all" && role !== "") {
            filteredUsers = users.filter((user) => user.role == role)
        }
        if (searchUser !== "") {
            filteredUsers = filteredUsers.filter((user) => user.firstname.includes(searchUser))


        }
        setFilteredUsers(filteredUsers)
    }

    return (
        <Container component="main" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
        }}>
            {!editingUser ? <>
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
                            {allRole.map((role, index) => (
                                <MenuItem key={index} value={role}>{role}</MenuItem>
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
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Username</TableCell>
                                <TableCell align="center">ชื่อ</TableCell>
                                <TableCell align="center">นามสกุล</TableCell>
                                <TableCell align="center">เบอร์โทรศัพท์</TableCell>
                                <TableCell align="center">ตำแหน่ง</TableCell>
                                <TableCell align="center">การกระทำ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {user.email}
                                    </TableCell>
                                    <TableCell align="center">{user.username}</TableCell>
                                    <TableCell align="center">{user.firstname}</TableCell>
                                    <TableCell align="center">{user.lastname}</TableCell>
                                    <TableCell align="center">{user.phone}</TableCell>
                                    <TableCell align="center">{user.role}</TableCell>
                                    <TableCell align="center">
                                        <button onClick={() => editUser(user.username, user.role)}>แก้ไข</button>
                                        <button onClick={() => deleteUser(user.username, user.role)}>ลบ</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer></> :
                <>
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        marginTop: "10px",
                        marginLeft: "10px",
                        cursor: "pointer"

                    }} onClick={() => setEditingUser(undefined)}>ย้อนกลับ</div>
                    <EditProfile jwt_token={prop.jwt_token} admin={{ username: editingUser.username, role: editingUser.role }} />
                </>
            }
        </Container>
    )
}

export default ManageUser
