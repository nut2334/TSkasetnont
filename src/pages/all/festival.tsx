import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { th } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
import type {
  ProcessedEvent,
  SchedulerHelpers,
} from "@aldabil/react-scheduler/types";
import { Button, DialogActions, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import * as config from "../../config/config";

interface CustomEditorProps {
  scheduler: SchedulerHelpers;
}

const Festival = (prop: { jwt_token: string }) => {
  const [role, setRole] = React.useState<string>("");
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

  // const EVENTS = [
  //   {
  //     event_id: 1,
  //     title: "Event 1",
  //     start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
  //     end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
  //     editable: role == "admins" ? true : false,
  //     admin_id: [1, 2, 3, 4],
  //   },
  //   {
  //     event_id: 2,
  //     title: "Event 2",
  //     start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
  //     end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
  //     admin_id: 2,
  //     color: "#50b500",
  //   },
  //   {
  //     event_id: 3,
  //     title: "Event 3",
  //     start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
  //     end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
  //     admin_id: 1,
  //     editable: false,
  //     deletable: false,
  //   },
  //   {
  //     event_id: 4,
  //     title: "Event 4",
  //     start: new Date(
  //       new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
  //         new Date().getDate() - 2
  //       )
  //     ),
  //     end: new Date(
  //       new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
  //         new Date().getDate() - 2
  //       )
  //     ),
  //     admin_id: 2,
  //     color: "#900000",
  //   },
  //   {
  //     event_id: 5,
  //     title: "Event 5",
  //     start: new Date(
  //       new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
  //         new Date().getDate() - 2
  //       )
  //     ),
  //     end: new Date(
  //       new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
  //         new Date().getDate() - 2
  //       )
  //     ),
  //     admin_id: 2,
  //     editable: true,
  //   },
  //   {
  //     event_id: 6,
  //     title: "Event 6",
  //     start: new Date(
  //       new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
  //         new Date().getDate() - 4
  //       )
  //     ),
  //     end: new Date(new Date(new Date().setHours(14)).setMinutes(0)),
  //     admin_id: 2,
  //   },
  // ];
  useEffect(() => {
    if (prop.jwt_token) {
      let role = jwtDecode(prop.jwt_token) as { role: string };
      console.log(role.role === "admins" ? true : false);
      setRole(role.role);
    }
  }, [prop.jwt_token]);
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
            admin_id: [1, 2, 3, 4],
            color: "#50b500",
          },
        ]);
      });
    });
  }, []);

  const CustomEditor = ({ scheduler }: CustomEditorProps) => {
    const event = scheduler.edited;

    // Make your own form/state
    const [state, setState] = useState({
      title: event?.title || "",
      description: event?.description || "",
      start: event?.start || scheduler.state.start.value,
      end: event?.end || null,
    });
    const [error, setError] = useState("");

    const handleChange = (value: string, name: string) => {
      setState((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    };
    const handleSubmit = async () => {
      // Your own validation
      if (state.title.length < 3) {
        return setError("Min 3 letters");
      }

      try {
        scheduler.loading(true);

        /**Simulate remote data saving */
        const added_updated_event = (await new Promise((res) => {
          /**
           * Make sure the event have 4 mandatory fields
           * event_id: string|number
           * title: string
           * start: Date|string
           * end: Date|string
           */

          setTimeout(() => {
            if (state.end == null || state.start == null) {
              return;
            }
            res({
              event_id: event ? event.event_id : Math.random(),
              title: state.title,
              description: state.description,
              start: state.start,
              end: state.end,
            });
          }, 3000);
        })) as ProcessedEvent;

        scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
        scheduler.close();
      } finally {
        const data = {
          name: state.title,
          keyword: state.description.split(",").map((e: string) => e.trim()),
          start_date: state.start,
          end_date: state.end,
        };
        axios
          .post(config.getApiEndpoint("festival", "POST"), data, {
            headers: {
              Authorization: `Bearer ${prop.jwt_token}`,
            },
          })
          .then((res) => {
            console.log(res);
          });
        scheduler.loading(false);
      }
    };
    return (
      <div>
        <div style={{ padding: "1rem" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="ชื่อเทศกาล"
                value={state.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.value, "title")
                }
                error={!!error}
                helperText={error}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="คำค้นหาสินค้า"
                value={state.description}
                onChange={(e) => handleChange(e.target.value, "description")}
                fullWidth
                placeholder="ทุเรียน,มังคุด,ส้มโอ,มะม่วง,ลำไย,สตอเบอรี่,แอปเปิ้ล,กล้วย"
                multiline
                rows={2}
              />
            </Grid>
            {/* เวลาวันที่ */}
            <Grid item xs={6}>
              <Typography>เวลาเริ่มต้น</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  defaultValue={state.start ? dayjs(state.start) : null}
                  minDate={dayjs()}
                  onChange={(e: any) => {
                    console.log(e.toDate());
                    handleChange(e.toDate(), "start");
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <Typography>วันสิ้นสุดการจอง</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  minDate={
                    state.start
                      ? dayjs(state.start).add(1, "day")
                      : dayjs().add(1, "day")
                  }
                  value={state.end ? dayjs(state.end) : null}
                  onChange={(e: any) => {
                    console.log(e.toDate());
                    handleChange(e.toDate(), "end");
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </div>
        <DialogActions>
          <Button variant="contained" color="error" onClick={scheduler.close}>
            ยกเลิก
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            ยืนยัน
          </Button>
        </DialogActions>
      </div>
    );
  };
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
        customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
      />
    </Container>
  );
};

export default Festival;
