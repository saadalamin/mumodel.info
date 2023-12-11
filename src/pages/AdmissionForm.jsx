import React from "react";
import { Link } from "react-router-dom";

/* Components */
import Navbar from "../components/Navbar";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import Edit from "../components/Edit";
import TextField from "@mui/material/TextField";

/* Icons */
import Delete from "@mui/icons-material/Delete";
import { ArrowBack, Edit as EditIcon } from "@mui/icons-material";

/* Utils */
import {
 $firebase_database_delete,
 $firebase_database_read,
} from "../utils/firebase";
import useEffectForFirebase from "../utils/useEffectFirebase";

export default function Admissions({ branches, auth }) {
 let formQuery = new URLSearchParams(window.location.search).get("q");
 let formBranch = new URLSearchParams(window.location.search).get("b");

 const FormErrorContainer = (
  <div
   style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
   }}
  >
   <h2
    style={{
     color: "#333",
     fontSize: "2rem",
     marginBottom: "0.5rem",
    }}
   >
    404 Not Found!
   </h2>
   <p style={{ color: "gray" }}>
    The form you are looking for does not exist. Please double check the Form
    ID.
   </p>
  </div>
 );

 /*** FIREBASE ***/
 const [admissionForm, setAdmissionForm] = React.useState(false);
 const [show404, setShow404] = React.useState(false);
 const [errorAlert, setErrorAlert] = React.useState("");
 const [openAlert, setOpenAlert] = React.useState(false);
 const [refresh, setRefresh] = React.useState({
  admission: 0,
 });

 useEffectForFirebase(
  [, refresh.admission],
  () => {
   $firebase_database_read(
    `websites/${formBranch}/admissions/apply/${formQuery}/`,
    async (data) => {
     if (data) {
      setAdmissionForm(data);
      setShow404(false);
     } else {
      setShow404(true);
     }
    },
    (e) => {
     setErrorAlert(e);
     setOpenAlert(true);
     setShow404(true);
    }
   );
   console.log(admissionForm);
  },
  () => {
   setAdmissionForm(false);
  }
 );

 return (
  <>
   <Navbar auth={auth} />
   {auth && formQuery && !show404 && (
    <>
     <Modal
      title="Admissions"
      body={errorAlert}
      isOpen={openAlert}
      onCancel={() => {
       setOpenAlert(false);
       setErrorAlert("");
      }}
     />
     <div className="admission">
      <Paper sx={{ padding: "2rem 1.5rem", marginBottom: 3 }}>
       <Container
        sx={{
         padding: 0,
        }}
       >
        <h2
         style={{
          paddingBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
         }}
        >
         Admission Form
         <Button
          sx={{ marginLeft: "auto" }}
          size="small"
          variant="outlined"
          onClick={() => {
           setRefresh((rf) => {
            return {
             admission: rf.admission + 1,
            };
           });
           setLoadingAfterBranch(true);
          }}
         >
          Refresh
         </Button>
        </h2>
        <br />
        <Link to="/admissions">
         <Button variant="contained" startIcon={<ArrowBack />}>
          Go Back
         </Button>
        </Link>
       </Container>
      </Paper>
      <Container sx={{ marginTop: 4, marginBottom: 5 }}>
       <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
         <Typography variant="h6" style={{ paddingBottom: "0.2rem" }}>
          Actions
         </Typography>
         <Typography
          variant="p"
          sx={{
           fontSize: "0.8rem",
           color: "gray",
           display: "block",
           marginBottom: "0",
           mt: 2,
           mb: 1,
          }}
         >
          Search
         </Typography>
         <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
           variant="filled"
           label="Application Form"
           size="small"
           disabled
           value={formQuery}
           sx={{
            width: "100%",
            maxWidth: "300px",
           }}
           placeholder="Form ID"
          />
          <Button
           variant="contained"
           sx={{ ml: 2, py: "0.73rem" }}
           color="primary"
           disabled
          >
           Search
          </Button>
         </div>
         <Paper sx={{ mt: 2, p: 2, minHeight: "200px" }}>
          <p
           style={{
            color: "gray",
            fontSize: "0.9rem",
           }}
          >
           Searched for :-
          </p>
         </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
         <Typography variant="h6" style={{ paddingBottom: "0.2rem" }}>
          Searched Form
         </Typography>
         {admissionForm ? Object.keys(admissionForm).length >= 0 && (
          <Card sx={{ marginTop: 2, padding: 2 }} elevation={1}>
           <h4>{admissionForm.name}</h4>
           <p style={{ color: "gray", fontSize: "0.93rem" }}>
            {admissionForm.apply_mobile}
           </p>
           <br />
           <div style={{ display: "flex", overflowX: "scroll" }}>
            <p
             style={{
              fontSize: "0.8rem",
              display: "flex",
             }}
            >
             <Chip
              label={new Date(admissionForm.date).toDateString()}
              size="small"
              sx={{ marginRight: "0.3rem" }}
             />
             <Chip
              label={admissionForm.class}
              size="small"
              sx={{
               display: !admissionForm.class && "none",
               marginRight: "0.3rem",
              }}
             />
             <Chip
              label={admissionForm.division}
              size="small"
              sx={{
               display: !admissionForm.division && "none",
              }}
             />
            </p>
           </div>
          </Card>
         ) : (
            <p style={{ color: "gray" }}>Loading...</p>
         )}
        </Grid>
       </Grid>
      </Container>
     </div>
    </>
   )}
   {(!formQuery || show404) && FormErrorContainer}
  </>
 );
}
