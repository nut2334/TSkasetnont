import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { NavLink, Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import * as config from "../config/config";
import EditProfile from "../pages/editprofile";

interface userInterface {
  id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  certificates: string[];
  certificateCount: number;
  productCount: number;
  lastLogin: Date;
}

const Searchtable = (prop: {
  jwt_token: string;
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
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
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchUsername, setSearchUsername] = useState<string>("");

  const [role, setRole] = useState<
    "admins" | "tambons" | "farmers" | "providers" | "members" | "all"
  >("all");
  const [users, setUsers] = useState<userInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userInterface[]>([]);
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [allStandardProducts, setAllStandardProducts] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);
  const [editingUser, setEditingUser] = useState<{
    username: string;
    role: string;
  }>();
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
  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "firstname", headerName: "ชื่อ", flex: 1 },
    { field: "lastname", headerName: "นามสกุล", flex: 1 },
    { field: "phone", headerName: "เบอร์โทรศัพท์", flex: 1 },
    {
      field: "role",
      headerName: "บทบาท",
      flex: 1,
      renderCell: (params) => {
        if (params.value === "admins") {
          return "ผู้ดูแลระบบ";
        }
        if (params.value === "tambons") {
          return "ผู้ดูแลตำบล";
        }
        if (params.value === "farmers") {
          return "เกษตรกร";
        }
        if (params.value === "providers") {
          return "ผู้จัดจำหน่าย";
        }
        if (params.value === "members") {
          return "สมาชิก";
        }
      },
    },
    {
      field: "action",
      headerName: "การกระทำ",
      renderCell: (params) => (
        <>
          <EditIcon
            sx={{
              color: "#F9D923",
              cursor: "pointer",
            }}
            onClick={() => editUser(params.row.username, params.row.role)}
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
                  deleteUser(params.row.username, params.row.role);
                }
              });
            }}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    const callApi = async () => {
      let apiGetMembers = config.getApiEndpoint(`users/members`, "GET");
      let apiGetAdmin = config.getApiEndpoint(`users/admins`, "GET");
      let apiGetTambon = config.getApiEndpoint(`users/tambons`, "GET");
      let apiGetProvider = config.getApiEndpoint(`users/providers`, "GET");
      let apiGetFarmer = config.getApiEndpoint(`users/farmers`, "GET");

      let member = await axios.get(apiGetMembers, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
      let admin = await axios.get(apiGetAdmin, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
      let tambon = await axios.get(apiGetTambon, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
      let provider = await axios.get(apiGetProvider, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
      let farmer = await axios.get(apiGetFarmer, {
        headers: {
          Authorization: `Bearer ${prop.jwt_token}`,
        },
      });
      let allUser = member.data.concat(
        admin.data,
        tambon.data,
        provider.data,
        farmer.data
      );
      setUsers(allUser);
      setFilteredUsers(allUser);
    };
    callApi();
  }, []);

  const handleSearch = () => {
    let filteredUsers = users;
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

    if (role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    if (email !== "") {
      filteredUsers = filteredUsers.filter((user) =>
        user.email.includes(email)
      );
    }

    if (phone !== "") {
      filteredUsers = filteredUsers.filter((user) =>
        user.phone.includes(phone)
      );
    }

    setFilteredUsers(filteredUsers);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 5,
      }}
    >
      {!editingUser ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5">
                จัดการผู้ใช้งาน
              </Typography>
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

            <Grid item xs={6}>
              <TextField
                label="email"
                fullWidth
                onChange={(event) => {
                  setEmail(event.target.value as string);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="เบอร์โทรศัพท์"
                fullWidth
                onChange={(event) => {
                  setPhone(event.target.value as string);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="ตำแหน่ง"
                fullWidth
                onChange={(event) => {
                  setRole(
                    event.target.value as
                      | "admins"
                      | "tambons"
                      | "farmers"
                      | "providers"
                      | "members"
                      | "all"
                  );
                }}
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="admins">ผู้ดูแลระบบ</MenuItem>
                <MenuItem value="tambons">เกษตรตำบล</MenuItem>
                <MenuItem value="farmers">เกษตรกร</MenuItem>
                <MenuItem value="providers">เกษตรจังหวัด</MenuItem>
                <MenuItem value="members">สมาชิก</MenuItem>
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <Button
                variant="contained"
                color="info"
                onClick={handleSearch}
                sx={{ marginRight: "10px", marginBottom: "10px" }}
                startIcon={<SearchIcon />}
              >
                ค้นหา
              </Button>
            </Grid>
          </Grid>
          <div
            style={{
              height: 500,
              width: "100%",
              marginTop: "10px",
              position: "sticky",
            }}
          >
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        </>
      ) : (
        <EditProfile
          followList={prop.followList}
          jwt_token={prop.jwt_token}
          setJwt_token={prop.setJwt_token}
          admin={{ username: editingUser.username, role: editingUser.role }}
          setFollowList={prop.setFollowList}
        />
      )}
    </Container>
  );
};

export default Searchtable;
