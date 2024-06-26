import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { jwtDecode } from "jwt-decode";
import type { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Button, DialogActions, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import * as config from "../../config/config";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { SketchPicker } from "react-color";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { th } from "date-fns/locale";

dayjs.extend(buddhistEra);

interface CustomEditorProps {
  scheduler: SchedulerHelpers;
}

const Editfestival = (prop: { jwt_token: string }) => {
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [events, setEvents] = React.useState<
    {
      event_id: number;
      title: string;
      start: Date;
      end: Date;
      editable?: boolean;
      admin_id: number | number[];
      color?: string;
      everyYear?: boolean;
      editor_info?: {
        editor_username: string;
        lastmodified: string;
      };
    }[]
  >([]);
  const [keywordError, setKeywordError] = useState<boolean>(false);
  const [startError, setStartError] = useState<boolean>(false);
  const [endError, setEndError] = useState<boolean>(false);

  useEffect(() => {
    if (prop.jwt_token) {
      let role = (jwtDecode(prop.jwt_token) as { role: string }).role;
      if (role == "admins") {
        setIsAdmin(true);
        console.log("Admin");
      } else {
        setIsAdmin(false);
      }
    }
  }, [prop.jwt_token]);

  useEffect(() => {
    if (prop.jwt_token) {
      let role = (jwtDecode(prop.jwt_token) as { role: string }).role;
      if (role == "admins") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    axios.get(config.getApiEndpoint("festival", "GET")).then((res) => {
      console.log(res.data);
      let data = res.data.map((e: any) => {
        return {
          event_id: e.id,
          description: JSON.parse(e.keywords).join(", "),
          title: e.name,
          start: new Date(e.start_date),
          end: new Date(e.end_date),
          color: e.color,
          admin_id: 1,
          editable: true,
          everyYear: e.everyYear,
          editor_info: {
            editor_username: e.editor_info?.editor_username,
            lastmodified: e.editor_info?.lastmodified,
          },
        };
      });
      setEvents(data);
    });
  }, []);

  const handleDelete = async (deletedId: string): Promise<string> => {
    console.log("Deleted id: ", deletedId);
    axios.delete(config.getApiEndpoint(`festival/${deletedId}`, "DELETE"), {
      headers: {
        Authorization: `Bearer ${prop.jwt_token}`,
      },
    });
    if (prop.jwt_token) {
      let role = (jwtDecode(prop.jwt_token) as { role: string }).role;
      if (role == "admins") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    axios.get(config.getApiEndpoint("festival", "GET")).then((res) => {
      console.log(res.data);
      let data = res.data.map((e: any) => {
        return {
          event_id: e.id,
          description: JSON.parse(e.keywords).join(", "),
          title: e.name,
          start: new Date(e.start_date),
          end: new Date(e.end_date),
          color: e.color,
          admin_id: 1,
          editable: true,
          everyYear: e.everyYear,
          editor_info: {
            editor_username: e.editor_info?.editor_username,
            lastmodified: e.editor_info?.lastmodified,
          },
        };
      });
      setEvents(data);
    });
    // Simulate http request: return the deleted id
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(deletedId);
      }, 3000);
    });
  };

  const CustomEditor = ({ scheduler }: CustomEditorProps) => {
    const event = scheduler.edited;
    // Make your own form/state
    const [state, setState] = useState({
      title: event?.title || "",
      description: event?.description || "",
      start: event?.start || scheduler.state.start.value,
      end: event?.end || null,
      color: event?.color || "#50b500",
      everyYear: event?.everyYear || false,
      editor_info: event?.editor_info || {
        editor_username: "",
        lastmodified: "",
      },
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
        return setError("ชื่อเทศกาลอย่างน้อย 3 ตัวอักษร");
      }
      if (state.description == "") {
        return setKeywordError(true);
      }
      if (state.start == null) {
        return setStartError(true);
      }
      if (state.end == null) {
        return setEndError(true);
      }

      try {
        scheduler.loading(true);
        /**Simulate remote data saving */
        const data = {
          festname: state.title,
          keyword: state.description.split(",").map((e: string) => e.trim()),
          start_date: state.start,
          end_date: state.end,
          color: state.color,
          everyYear: state.everyYear,
        };
        let event_id = "";
        if (event) {
          /** PUT event to remote DB */
          await axios
            .patch(
              config.getApiEndpoint(`festival/${event.event_id}`, "patch"),
              data,
              {
                headers: {
                  Authorization: `Bearer ${prop.jwt_token}`,
                },
              }
            )
            .then((res) => {
              axios
                .get(config.getApiEndpoint("festival", "GET"))
                .then((res) => {
                  console.log(res.data);
                  let data = res.data.map((e: any) => {
                    return {
                      event_id: e.id,
                      description: JSON.parse(e.keywords).join(", "),
                      title: e.name,
                      start: new Date(e.start_date),
                      end: new Date(e.end_date),
                      color: e.color,
                      admin_id: 1,
                      editable: true,
                      everyYear: e.everyYear,
                      editor_info: {
                        editor_username: e.editor_info?.editor_username,
                        lastmodified: e.editor_info?.lastmodified,
                      },
                    };
                  });
                  setEvents(data);
                });
            });
          if (prop.jwt_token) {
            let role = (jwtDecode(prop.jwt_token) as { role: string }).role;
            if (role == "admins") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
          axios.get(config.getApiEndpoint("festival", "GET")).then((res) => {
            console.log(res.data);
            res.data.map((e: any) => {
              setEvents((prev) => [
                ...prev,
                {
                  event_id: e.id,
                  description: JSON.parse(e.keywords).join(", "),
                  title: e.name,
                  start: new Date(e.start_date),
                  end: new Date(e.end_date),
                  color: e.color,
                  admin_id: 1,
                  editable: true,
                  everyYear: true,
                },
              ]);
            });
          });
        } else if (event === undefined) {
          /**POST event to remote DB */
          let response = await axios.post(
            config.getApiEndpoint("festival", "POST"),
            data,
            {
              headers: {
                Authorization: `Bearer ${prop.jwt_token}`,
              },
            }
          );
          if (prop.jwt_token) {
            let role = (jwtDecode(prop.jwt_token) as { role: string }).role;
            if (role == "admins") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
          axios.get(config.getApiEndpoint("festival", "GET")).then((res) => {
            console.log(res.data);
            res.data.map((e: any) => {
              setEvents((prev) => [
                ...prev,
                {
                  event_id: e.id,
                  description: JSON.parse(e.keywords).join(", "),
                  title: e.name,
                  start: new Date(e.start_date),
                  end: new Date(e.end_date),
                  color: e.color,
                  admin_id: 1,
                  editable: true,
                  everyYear: e.everyYear,
                },
              ]);
            });
          });
          event_id = response.data.id;
        }
        const added_updated_event = (await new Promise((res) => {
          setTimeout(() => {
            console.log(event_id, event?.event_id);
            if (state.end == null || state.start == null) {
              return;
            }
            res({
              event_id: event?.event_id || event_id,
              title: state.title,
              description: state.description,
              start: state.start,
              end: state.end,
              color: state.color,
              everyYear: state.everyYear,
            });
          }, 3000);
        })) as ProcessedEvent;

        scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
        scheduler.close();
      } finally {
        scheduler.loading(false);
        window.location.reload();
      }
    };

    return (
      <div>
        <div style={{ padding: "1rem" }}>
          <Grid
            container
            spacing={2}
            //center
          >
            {state.editor_info.editor_username ||
            state.editor_info.lastmodified ? (
              <Grid item xs={12} textAlign="right">
                <Typography color="textSecondary">
                  แก้ไขล่าสุดโดย {state.editor_info.editor_username} วันที่{" "}
                  {new Date(state.editor_info.lastmodified).toLocaleDateString(
                    "th-TH",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      minute: "numeric",
                      hour: "numeric",
                    }
                  )}
                </Typography>
              </Grid>
            ) : (
              <></>
            )}
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
                error={keywordError}
                helperText={keywordError ? "กรุณากรอกคำค้นหา" : ""}
                disabled={event?.description ? true : false}
              />
            </Grid>
            {/* เวลาวันที่ */}
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.everyYear}
                      value={state.everyYear}
                      onChange={(e) => {
                        handleChange(e.target.value, "everyYear");
                        setState((prev) => {
                          return {
                            ...prev,
                            everyYear: e.target.checked,
                          };
                        });
                      }}
                    />
                  }
                  label="เทศกาลประจำปี"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <Typography>วันที่เริ่มเทศกาล*</Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="th"
              >
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
              <Typography color="error">
                {startError ? "กรุณาเลือกวันที่เริ่มเทศกาล" : ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>วันสิ้นสุดเทศกาล*</Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="th"
              >
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
              <Typography color="error">
                {endError ? "กรุณาเลือกวันที่สิ้นสุดเทศกาล" : ""}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <SketchPicker
                color={state.color}
                disableAlpha
                onChange={(color) => {
                  setState((prev) => {
                    return {
                      ...prev,
                      color: color.hex,
                    };
                  });
                }}
              />
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
        onCellClick={(e) => {
          console.log(e);
        }}
        view="month"
        week={null}
        customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
        onDelete={handleDelete}
        locale={th}
      />
    </Container>
  );
};

export default Editfestival;
