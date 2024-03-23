import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import * as config from "../../config/config";
import Swal from "sweetalert2";
const Confirm = () => {
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
  return redirect ? <Navigate to="/login" /> : <></>;
};

export default Confirm;
