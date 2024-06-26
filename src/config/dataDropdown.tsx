import React from "react";

export const reservation_status = [
  {
    statusID: "reservationOpenAlways",
    statusName: "เปิดรับจองตลอด",
  },
  {
    statusID: "reservationOpenPeriod",
    statusName: "เปิดรับจองตามช่วงเวลา",
  },
  {
    statusID: "reservationClose",
    statusName: "ปิดรับจอง",
  },
];

export const web_activity = [
  {
    activityID: "activity01",
    activityName: "ประชาสัมพันธ์",
  },
  {
    activityID: "activity02",
    activityName: "จองสินค้าผ่านเว็บไซต์",
  },
  {
    activityID: "activity03",
    activityName: "สินค้าจัดส่งพัสดุ",
  },
];

export const nonthaburi_amphure = [
  {
    amphureID: "1001",
    amphureName: "เมืองนนทบุรี",
  },
  {
    amphureID: "1002",
    amphureName: "บางกรวย",
  },
  {
    amphureID: "1003",
    amphureName: "บางใหญ่",
  },
  {
    amphureID: "1004",
    amphureName: "บางบัวทอง",
  },
  {
    amphureID: "1005",
    amphureName: "ไทรน้อย",
  },
  {
    amphureID: "1006",
    amphureName: "ปากเกร็ด",
  },
];

export const status_buy = [
  {
    statusID: "waiting",
    statusName: "รอจัดส่ง",
  },
  {
    statusID: "complete",
    statusName: "สำเร็จ",
  },
  {
    statusID: "reject",
    statusName: "ยกเลิก",
  },
  {
    statusID: "pending",
    statusName: "รอการตรวจสอบ",
  },
];

export const status_reserve = [
  {
    statusID: "complete",
    statusName: "สำเร็จ",
  },
  {
    statusID: "reject",
    statusName: "ยกเลิก",
  },
  {
    statusID: "pending",
    statusName: "รอการตรวจสอบ",
  },
];

export const event_status = [
  {
    statusID: "accept",
    statusName: "สินค้าพร้อมจำหน่าย",
  },
  {
    statusID: "waiting",
    statusName: "รอการตรวจสอบ",
  },
  {
    statusID: "reject",
    statusName: "ไม่พร้อมจำหน่าย",
  },
];

export const month = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
