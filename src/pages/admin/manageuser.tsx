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
import MenuItem from "@mui/material/MenuItem";
import { NavLink, Navigate } from "react-router-dom";
import * as config from "../../config/config";
import axios from "axios";
import EditProfile from "../editprofile";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

interface userInterface {
  id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
}
const ManageUser = (prop: {
  jwt_token: string;
  followList: { id: string; farmerstorename: string }[];
  setFollowList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        farmerstorename: string;
      }[]
    >
  >;
}) => {
  const [users, setUsers] = useState<userInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userInterface[]>([]);
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [role, setRole] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [viewFarmer, setViewFarmer] = useState<string>("");
  const [allRole, setAllrole] = useState<
    {
      role_id: string;
      role_name: string;
    }[]
  >([]);

  const [editingUser, setEditingUser] = useState<{
    username: string;
    role: string;
  }>();

  useEffect(() => {
    const apiFetchUsers = config.getApiEndpoint("users", "GET");
    const jwtD = jwtDecode(prop.jwt_token) as { role: string };
    setCurrentRole(jwtD.role);
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
    if (currentRole !== "tambons") {
      const apiRole = config.getApiEndpoint("role", "GET");
      axios
        .get(apiRole)
        .then((res) => {
          if (res.data) {
            setAllrole([{ role_id: "all", role_name: "ทั้งหมด" }, ...res.data]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const deleteUser = (username: string, role: string) => {
    const apiDeleteUser = config.getApiEndpoint(
      `deleteuser/${role}/${username}`,
      "DELETE"
    );
    axios
      .delete(apiDeleteUser, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          Swal.fire({
            icon: "success",
            title: "ลบสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          setUsers(users.filter((user) => user.username != username));
          setFilteredUsers(
            filteredUsers.filter((user) => user.username != username)
          );
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(error);
      });
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
    if (searchUsername !== "") {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.includes(searchUsername)
      );
    }
    setFilteredUsers(filteredUsers);
  };

  if (viewFarmer !== "") {
    return <Navigate to={`/managefarmer/${viewFarmer}`} />;
  }

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
              {currentRole != "tambons" && (
                <Typography component="h1" variant="h5">
                  จัดการสมาชิก
                </Typography>
              )}
              {currentRole == "tambons" && (
                <Typography component="h1" variant="h5">
                  จัดการเกษตรกร
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="ชื่อ"
                variant="outlined"
                fullWidth
                onChange={(event) =>
                  setSearchUser(event.target.value as string)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                onChange={(event) =>
                  setSearchUsername(event.target.value as string)
                }
              />
            </Grid>
            {currentRole !== "tambons" && (
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
            )}
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
              <NavLink
                to={currentRole == "tambons" ? "/addfarmer" : "/adduser"}
                style={{ textDecoration: "none" }}
              >
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
                          color: "#36AE7C",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          console.log(user.username);

                          if (currentRole === "tambons") {
                            setViewFarmer(user.username);
                          }
                        }}
                      />
                      <EditIcon
                        sx={{
                          color: "#F9D923",
                          cursor: "pointer",
                        }}
                        onClick={() => editUser(user.username, user.role)}
                      />
                      <DeleteIcon
                        sx={{
                          color: "#EB5353",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          Swal.fire({
                            title: "คุณแน่ใจหรือไม่?",
                            text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "ใช่, ลบข้อมูล!",
                            cancelButtonText: "ยกเลิก",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              {
                                deleteUser(user.username, user.role);
                              }
                            }
                          });
                        }}
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
          <EditProfile
            followList={prop.followList}
            jwt_token={prop.jwt_token}
            admin={{ username: editingUser.username, role: editingUser.role }}
            setFollowList={prop.setFollowList}
          />
        </>
      )}
      {editingUser && currentRole !== "tambons" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
            }}
          >
            <Button
              color="error"
              variant="contained"
              onClick={() => setEditingUser(undefined)}
            >
              ยกเลิก
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default ManageUser;
