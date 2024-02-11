import React from 'react'

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
      description: [
        "เก็บข้อมูลการติดต่อของลูกค้าเพียงอย่างเดียว",
        "เกษตรกรและลูกค้าสามารถนัดหมายวันเวลาได้",
      ],
    },
    {
      activityID: "activity03",
      activityName: "สินค้าจัดส่งพัสดุ",
    },
  ];