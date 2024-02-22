import styled from "@emotion/styled";
import { createTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const themeMui = createTheme({
  typography: {
    fontFamily: "Kanit",
    fontSize: 16,
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: 17,
    },
  },
  palette: {
    primary: {
      main: "#259b24",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#7D7C7C",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#adadad",
      contrastText: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

const Link = styled(NavLink)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

export default themeMui;
