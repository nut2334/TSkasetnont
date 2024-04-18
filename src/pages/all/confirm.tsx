import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import * as config from "../../config/config";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

const Confirm = (prop: {
  setJwt_token: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { email, hashed } = useParams<{ email: string; hashed: string }>();
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    let apiConfirm = config.getApiEndpoint(
      `confirm/${email}/${hashed}`,
      "POST"
    );
    axios
      .get(apiConfirm)
      .then((res) => {
        if (res.data.newToken) {
          const cookies = new Cookies();
          cookies.set("jwt_token", res.data.newToken, {
            path: "/",
            sameSite: "strict",
            secure: true,
          });
          prop.setJwt_token(res.data.newToken);
        }
        Swal.fire({
          title: "ยืนยันอีเมลเรียบร้อย",
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then((swal) => {
          if (swal.isConfirmed || swal.isDismissed) {
            setRedirect(true);
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "ไม่สามารถยืนยันอีเมลได้",
          icon: "error",
          confirmButtonText: "ตกลง",
        }).then(() => {
          setRedirect(true);
        });
      });
  }, []);
  return redirect ? <Navigate to="/" /> : <></>;
};

export default Confirm;
