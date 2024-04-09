import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { th } from "date-fns/locale";
import type { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import axios from "axios";
import * as config from "../../config/config";

interface CustomEditorProps {
  scheduler: SchedulerHelpers;
}

const Editfestival = (prop: { jwt_token: string }) => {
  const [events, setEvents] = React.useState<
    {
      event_id: number;
      title: string;
      start: Date;
      end: Date;
      editable?: boolean;
      admin_id: number | number[];
      color?: string;
    }[]
  >([]);

  useEffect(() => {
    axios.get(config.getApiEndpoint("festival", "GET")).then((res) => {
      console.log(res.data);
      res.data.map((e: any) => {
        setEvents((prev) => [
          ...prev,
          {
            event_id: e.id,
            title: e.name,
            start: new Date(e.start_date),
            end: new Date(e.end_date),
            color: "#50b500",
            admin_id: 1,
          },
        ]);
      });
    });
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 2,
      }}
    >
      <Scheduler
        events={events}
        view="month"
        locale={th}
        week={null}
        editable={false}
        deletable={false}
      />
    </Container>
  );
};

export default Editfestival;
