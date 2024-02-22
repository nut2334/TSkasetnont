import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Container, Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NavLink } from "react-router-dom";
import * as config from "../../config/config";
import axios from "axios";
import EditProfile from "../editprofile";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

interface userInterface {
  id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
}
const ManageUser = (prop: { jwt_token: string }) => {
  const [users, setUsers] = React.useState<userInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<userInterface[]>([]);
  const [searchUser, setSearchUser] = React.useState<string>("");
  const [role, setRole] = useState("");
  const [allRole, setAllrole] = useState<
    {
      role_id: string;
      role_name: string;
    }[]
  >([{ role_id: "all", role_name: "ทั้งหมด" }]);
  const [editingUser, setEditingUser] = useState<{
    username: string;
    role: string;
  }>();

  useEffect(() => {
    const apiFetchUsers = config.getApiEndpoint("users", "GET");

    axios
      .get(apiFetchUsers, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response: any) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      });
  }, []);

  useEffect(() => {
    const apiRole = config.getApiEndpoint("role", "GET");
    axios
      .get(apiRole)
      .then((res) => {
        if (res.data) {
          setAllrole((role) => [...role, ...res.data]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteUser = (username: string, role: string) => {
    let body = {
      id: username,
    };
    setUsers(users.filter((user) => user.id !== username));
  };

  const editUser = (username: string, role: string) => {
    setEditingUser({ username, role });
  };
  const handleSearch = () => {
    let filteredUsers = users;

    if (role !== "all" && role !== "") {
      filteredUsers = users.filter((user) => user.role == role);
    }
    if (searchUser !== "") {
      filteredUsers = filteredUsers.filter((user) =>
        user.firstname.includes(searchUser)
      );
    }
    setFilteredUsers(filteredUsers);
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        marginTop: "20px",
      }}
      maxWidth="lg"
    >
      {!editingUser ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5">
                จัดการสมาชิก
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="ชื่อสมาชิก"
                variant="outlined"
                fullWidth
                onChange={(event) =>
                  setSearchUser(event.target.value as string)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="ตำแหน่ง"
                fullWidth
                onChange={(event) => setRole(event.target.value as string)}
              >
                {allRole.map((role) => (
                  <MenuItem key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{ marginRight: "10px" }}
                startIcon={<SearchIcon />}
              >
                ค้นหา
              </Button>
              <NavLink to="/adduser" style={{ textDecoration: "none" }}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  เพิ่มสมาชิก
                </Button>
              </NavLink>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>

          <TableContainer
            component={Paper}
            sx={{
              marginTop: "20px",
              boxShadow: 0,
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #e0e0e0",
            }}
          >
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                      <RemoveRedEyeIcon
                        sx={{
                          color: "green",
                          cursor: "pointer",
                        }}
                      />
                      <EditIcon
                        sx={{
                          color: "darkorange",
                          cursor: "pointer",
                        }}
                        onClick={() => editUser(user.username, user.role)}
                      />
                      <DeleteIcon
                        sx={{
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => deleteUser(user.username, user.role)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              marginTop: "10px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            onClick={() => setEditingUser(undefined)}
          >
            ย้อนกลับ
          </div>
          <EditProfile
            jwt_token={prop.jwt_token}
            admin={{ username: editingUser.username, role: editingUser.role }}
          />
        </>
      )}
    </Container>
  );
};

export default ManageUser;
