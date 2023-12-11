import { createTheme } from "@mui/material/styles";

export const Theme = createTheme({
 palette: {
  mode: "light",
  primary: {
   main: "#1ab06a",
   contrastText: "#ffffff",
  },
  secondary: {
   main: "#ffffff",
  },
  background: {
   paper: "#ffffff",
   default: "#f5f5f5",
  },
 },
 typography: {
  fontFamily: [
   "Roboto",
   "-apple-system",
   "BlinkMacSystemFont",
   '"Segoe UI"',
   '"Helvetica Neue"',
   "Arial",
   "sans-serif",
   '"Apple Color Emoji"',
   '"Segoe UI Emoji"',
   '"Segoe UI Symbol"',
  ].join(","),
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 500,
 },
});
