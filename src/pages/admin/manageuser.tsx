import React, { useState, useEffect } from "react";
import { Button, Chip, Container, Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { NavLink, Navigate, useParams } from "react-router-dom";
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelDownload from "../provider/exceldownload";
import DownloadIcon from "@mui/icons-material/Download";
import Searchtable from "../../components/searchTable";

interface userInterface {
  id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  amphure: string;
  certificates: {
    standard_id: string;
  }[];
  categories: {
    category_name: string;
    count: number;
    bgcolor: string;
  }[];
  certificateCount: number;
  productCount: number;
  lastLogin: Date;
  createAt: Date;
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
  const [searchStandard, setSearchStandard] = useState<string>("");
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
  const [allCategories, setAllCategories] = useState<
    {
      category_name: string;
    }[]
  >([]);
  const [categories, setCategories] = useState("");
  const [amphure, setAmphure] = useState<
    | "จังหวัดอื่นๆ"
    | "เมืองนนทบุรี"
    | "บางบัวทอง"
    | "บางกรวย"
    | "บางใหญ่"
    | "ปากเกร็ด"
    | "ไทรน้อย"
    | "ทั้งหมด"
    | ""
  >("");
  const [allStandardProducts, setAllStandardProducts] = useState<
    {
      standard_id: string;
      standard_name: string;
    }[]
  >([]);
  const { role } = useParams() as {
    role: "admins" | "tambons" | "farmers" | "providers" | "members" | "all";
  };

  useEffect(() => {
    if (role === "all") return;
    const apiFetchUsers = config.getApiEndpoint(`users/${role}`, "GET");
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
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(config.getApiEndpoint("standardproducts", "GET")).then((res) => {
      setAllStandardProducts(res.data);
    });
  }, [role]);

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
    if (role === "farmers") {
      const apiCategory = config.getApiEndpoint("categories", "GET");
      axios
        .get(apiCategory)
        .then((res) => {
          if (res.data) {
            setAllCategories(res.data);
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
        console.log(searchStandard == "ST000" && user.certificates.length == 0);

        if (user.certificates.length == 0 && searchStandard == "ST000") {
          return user;
        }
        if (user.certificates.length == 0) return false;
        let found = user.certificates.find((cert) => {
          return cert.standard_id === searchStandard;
        });
        return found;
      });
    }

    if (amphure !== "ทั้งหมด" && amphure !== "") {
      filteredUsers = filteredUsers.filter((user) => {
        if (user.amphure == "" && amphure == "จังหวัดอื่นๆ") return true;
        return user.amphure == amphure;
      });
    }

    if (categories !== "ทั้งหมด" && categories !== "") {
      filteredUsers = filteredUsers.filter((user) => {
        let found = user.categories.find((cate) => {
          return cate.category_name === categories;
        });
        return found;
      });
    }
    setFilteredUsers(filteredUsers);
  };
  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "firstnamelastname",
      headerName: "ชื่อ",
      flex: 1,

      renderCell: (params) => {
        return `${params.row.firstname} ${params.row.lastname}`;
      },
    },

    { field: "phone", headerName: "เบอร์โทรศัพท์", flex: 1 },

    {
      field: "createAt",
      headerName: "เป็นสมาชิกตั้งแต่",
      flex: 1,
      renderCell: (params) =>
        new Date(params.row.createAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      field: "lastLogin",
      headerName: "เข้าสู่ระบบล่าสุด",
      flex: 1,

      renderCell: (params) => {
        const daysAgo = Math.round(
          (new Date().getTime() - new Date(params.row.lastLogin).getTime()) /
            (1000 * 3600 * 24)
        );
        return (
          <span
            style={{
              color:
                daysAgo === 0 ? "green" : daysAgo === 30 ? "red" : "inherit",
            }}
          >
            {daysAgo === 0
              ? "วันนี้"
              : daysAgo === 30
              ? "30" + " วันที่แล้ว"
              : daysAgo + " วันที่แล้ว"}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: "การกระทำ",
      flex: 1,
      renderCell: (params) => (
        <>
          {role === "farmers" && (
            <RemoveRedEyeIcon
              sx={{
                color: "#36AE7C",
                cursor: "pointer",
              }}
              onClick={() => {
                if (role === "farmers") {
                  setViewFarmer(params.row.username);
                }
              }}
            />
          )}
          {prop.jwt_token &&
            (jwtDecode(prop.jwt_token) as { role: string }).role !==
              "providers" && (
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
            )}
        </>
      ),
    },
  ];

  const downloadExcel = () => {
    const apiExcelDownload = config.getApiEndpoint("excel", "GET");
    axios
      .get(apiExcelDownload, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `TheBestKasetNont-รายชื่อและข้อมูลของเกษตกรที่อยู่ในระบบ(${
            new Date().toISOString().split("T")[0]
          }).xlsx`
        );
        document.body.appendChild(link);
        link.click();
      });
  };

  if (
    role !== "admins" &&
    role !== "farmers" &&
    role !== "members" &&
    role !== "tambons" &&
    role !== "providers" &&
    role !== "all"
  ) {
    return <Navigate to="/" />;
  }
  if (viewFarmer !== "") {
    return <Navigate to={`/manageuser/farmers/${viewFarmer}`} />;
  }

  if (role === "all")
    return (
      <Searchtable
        jwt_token={prop.jwt_token}
        followList={prop.followList}
        setFollowList={prop.setFollowList}
      />
    );

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
          {role == "farmers" && <ExcelDownload jwt_token={prop.jwt_token} />}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {currentRole != "tambons" && (
                <Typography component="h1" variant="h5">
                  จัดการ
                  {role === "admins"
                    ? "ผู้ดูแลระบบ"
                    : role === "farmers"
                    ? "เกษตรกร"
                    : role === "members"
                    ? "สมาชิก"
                    : role === "providers"
                    ? "เกษตรจังหวัด"
                    : "เกษตรตำบล"}
                </Typography>
              )}
              {currentRole == "tambons" && (
                <Typography component="h1" variant="h5">
                  จัดการเกษตรกร
                </Typography>
              )}
              <Typography>จำนวนทั้งหมด {filteredUsers.length} คน</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="ชื่อ"
                variant="outlined"
                fullWidth
                onChange={(event) => {
                  setSearchUser(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                onChange={(event) => {
                  setSearchUsername(event.target.value);
                }}
              />
            </Grid>
            {role === "farmers" && (
              <>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="มาตรฐาน"
                    fullWidth
                    onChange={(event) => {
                      setSearchStandard(event.target.value as string);
                    }}
                  >
                    <MenuItem value="all">ทั้งหมด</MenuItem>
                    {allStandardProducts.map((product) => (
                      <MenuItem
                        key={product.standard_id}
                        value={product.standard_id}
                      >
                        {product.standard_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {currentRole == "admins" && (
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="อำเภอ"
                      fullWidth
                      onChange={(event) => {
                        setAmphure(
                          event.target.value as
                            | "จังหวัดอื่นๆ"
                            | "เมืองนนทบุรี"
                            | "บางบัวทอง"
                            | "บางกรวย"
                            | "บางใหญ่"
                            | "ปากเกร็ด"
                            | "ไทรน้อย"
                            | "ทั้งหมด"
                            | ""
                        );
                      }}
                    >
                      <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
                      <MenuItem value="เมืองนนทบุรี">เมืองนนทบุรี</MenuItem>
                      <MenuItem value="บางบัวทอง">บางบัวทอง</MenuItem>
                      <MenuItem value="บางกรวย">บางกรวย</MenuItem>
                      <MenuItem value="บางใหญ่">บางใหญ่</MenuItem>
                      <MenuItem value="ปากเกร็ด">ปากเกร็ด</MenuItem>
                      <MenuItem value="ไทรน้อย">ไทรน้อย</MenuItem>
                      <MenuItem value="จังหวัดอื่นๆ">จังหวัดอื่นๆ</MenuItem>
                    </TextField>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <TextField
                    select
                    label="หมวดหมู่"
                    fullWidth
                    onChange={(event) => {
                      setCategories(event.target.value as string);
                    }}
                  >
                    <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
                    {allCategories.map((cate: { category_name: string }) => (
                      <MenuItem
                        key={cate.category_name}
                        value={cate.category_name}
                      >
                        {cate.category_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="info"
                onClick={handleSearch}
                sx={{ marginRight: "10px", marginBottom: "10px" }}
                startIcon={<SearchIcon />}
              >
                ค้นหา
              </Button>
              {prop.jwt_token &&
                (jwtDecode(prop.jwt_token) as { role: string }).role !==
                  "providers" && (
                  <NavLink
                    to={`/adduser/${role}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      เพิ่ม
                      {role === "admins"
                        ? "ผู้ดูแลระบบ"
                        : role === "farmers"
                        ? "เกษตรกร"
                        : role === "members"
                        ? "สมาชิก"
                        : role === "providers"
                        ? "เกษตรจังหวัด"
                        : "เกษตรตำบล"}
                    </Button>
                  </NavLink>
                )}
              {role == "farmers" && (
                <Button
                  sx={{
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                  disabled={
                    (jwtDecode(prop.jwt_token) as { role: string }).role ===
                    "providers"
                  }
                  onClick={downloadExcel}
                  variant="contained"
                  startIcon={<DownloadIcon />}
                >
                  Excel Download
                </Button>
              )}
            </Grid>
          </Grid>

          <div style={{ height: 500, width: "100%", marginTop: "10px" }}>
            <DataGrid
              rows={filteredUsers}
              columns={
                role === "farmers"
                  ? [
                      ...columns.slice(0, columns.length - 3),
                      {
                        field: "certiCount",
                        headerName: "จำนวนมาตรฐาน",
                        flex: 1,
                      },
                      {
                        field: "productCount",
                        headerName: "จำนวนสินค้า",
                        flex: 1,
                      },
                      ...columns.slice(columns.length - 3, columns.length),
                    ]
                  : columns
              }
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
        <>
          <EditProfile
            followList={prop.followList}
            jwt_token={prop.jwt_token}
            admin={{ username: editingUser.username, role: editingUser.role }}
            setFollowList={prop.setFollowList}
          />
        </>
      )}
      {editingUser && role == "farmers" && (
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
