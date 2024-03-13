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

const Searchtable = (prop: { jwt_token: string }) => {
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [searchStandard, setSearchStandard] = useState<string>("");
  const [users, setUsers] = useState<userInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userInterface[]>([]);
  const [editingUser, setEditingUser] = useState<{
    username: string;
    role: string;
  }>();
  const [allStandardProducts, setAllStandardProducts] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);

  const { role } = useParams() as {
    role: "admins" | "tambons" | "farmers" | "providers" | "members" | "all";
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "firstname", headerName: "ชื่อ", flex: 1 },
    { field: "lastname", headerName: "นามสกุล", flex: 1 },
    { field: "phone", headerName: "เบอร์โทรศัพท์", flex: 1 },
    {
      field: "action",
      headerName: "การกระทำ",
      renderCell: (params) => (
        <>
          <RemoveRedEyeIcon
            sx={{
              color: "#36AE7C",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log(params.row.username);
            }}
          />
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
    axios.get(config.getApiEndpoint("standardproducts", "GET")).then((res) => {
      console.log(res.data);
      setAllStandardProducts(res.data);
    });
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
    if (searchStandard !== "all" && searchStandard !== "") {
      filteredUsers = filteredUsers.filter((user) => {
        if (!user.certificates) return false;
        console.log(user.certificates, "ass", searchStandard);
        let found = user.certificates.find((cert) => {
          return cert === searchStandard;
        });
        return found;
      });
    }

    setFilteredUsers(filteredUsers);
  };

  const editUser = (username: string, role: string) => {
    setEditingUser({ username, role });
  };

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

  return (
    <Container maxWidth="lg">
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
            onChange={(event) => setSearchUser(event.target.value as string)}
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
            select
            label="มาตรฐาน"
            fullWidth
            onChange={(event) => {
              console.log(event.target.value);
              setSearchStandard(event.target.value as string);
            }}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {allStandardProducts.map((product) => (
              <MenuItem key={product.standard_id} value={product.standard_id}>
                {product.standard_name}
              </MenuItem>
            ))}
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
    </Container>
  );
};

export default Searchtable;
