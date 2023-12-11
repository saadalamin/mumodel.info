import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Guest from "./components/Guest";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import Home from "./pages/Home";
import Admissions from "./pages/Admissions";
import AdmissionForm from "./pages/AdmissionForm";
import Notices from "./pages/Notices";
import Posts from "./pages/Posts";
import Academics from "./pages/Academics";

/* Utils */
import {
 $firebase_database_read,
 $firebase_auth_check_admin,
 $firebase_auth_logout,
 $firebase_auth_onAuth,
} from "./utils/firebase";
import useEffectForFirebase from "./utils/useEffectFirebase";

function App() {
 /*** FIREBASE ***/
 const [branches, setBranches] = React.useState({ branches: "", myAccess: "" });
 const [auth, setAuth] = React.useState(null);
 React.useEffect(() => {
  $firebase_auth_onAuth((user) => {
   if (user) {
    $firebase_auth_check_admin((admin) => {
     if (admin) {
      setAuth(true);
     } else {
      setAuth(false);
      $firebase_auth_logout();
     }
    });
   } else {
    setAuth(false);
   }
  });
 }, []);
 useEffectForFirebase([], () => {
  $firebase_database_read("branches/", async (data) => {
   if (data) {
    setBranches({
     branches: data,
    });
    $firebase_database_read("settings/admins/", async (data0) => {
     setBranches({
      branches: data,
      myAccess: data0,
     });
    });
   }
  });
 });

 return (
  <>
   {auth && (
    <div className="Admin">
     <BrowserRouter basename="/">
      <Routes>
       <Route
        path="/"
        element={<Home branches={branches} auth={auth} />}
       ></Route>
       <Route
        path="/admissions"
        element={<Admissions branches={branches} auth={auth} />}
       ></Route>
       <Route
        path="/admissions/application"
        element={<AdmissionForm branches={branches} auth={auth} />}
       ></Route>
       <Route
        path="/notices"
        element={<Notices branches={branches} auth={auth} />}
       ></Route>
       <Route
        path="/posts"
        element={<Posts branches={branches} auth={auth} />}
       ></Route>
       <Route
        path="/academics"
        element={<Academics branches={branches} auth={auth} />}
       ></Route>
       <Route
        path="*"
        element={<Home branches={branches} auth={auth} />}
       ></Route>
      </Routes>
     </BrowserRouter>
    </div>
   )}
   {auth == false && <Guest authTop={auth} />}
   {auth == null && (
    <Box
     sx={{
      display: "flex",
      width: "100%",
      minHeight: "90vh",
      justifyContent: "center",
      alignItems: "center",
     }}
    >
     <CircularProgress />
    </Box>
   )}
  </>
 );
}

export default App;
