import React from "react";
import Swal from "sweetalert2";

export const AdduserSuccess = () => {
  return Swal.fire({
    icon: "success",
    title: "เพิ่มสำเร็จ",
    showConfirmButton: false,
    timer: 1500,
  });
};

export const AdduserFail = () => {
  return Swal.fire({
    icon: "error",
    title: "เพิ่มไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
    showConfirmButton: false,
    timer: 1500,
  });
};

export const EdituserSuccess = () => {
  return Swal.fire({
    icon: "success",
    title: "แก้ไขสำเร็จ",
    showConfirmButton: false,
    timer: 1500,
  });
};

export const EdituserFail = () => {
  return Swal.fire({
    icon: "error",
    title: "แก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
    showConfirmButton: false,
    timer: 1500,
  });
};
