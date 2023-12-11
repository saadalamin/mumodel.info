import React from "react";

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
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import Edit from "../components/Edit";
import CircularProgress from "@mui/material/CircularProgress";

/* Icons */
import Delete from "@mui/icons-material/Delete";
import { Edit as EditIcon, WebOutlined } from "@mui/icons-material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

/* Utils */
import {
 $firebase_database_delete,
 $firebase_database_read,
} from "../utils/firebase";
import useEffectForFirebase from "../utils/useEffectFirebase";
import { Box, TextField } from "@mui/material";

export default function Admissions({ branches, auth }) {
 let getBranch = window.localStorage.getItem("admin.mumodel.info-branch");

 /*** FIREBASE ***/
 const [admissionForms, setAdmissionForms] = React.useState(false);
 const [branch, setBranch] = React.useState(getBranch || "");
 const [myAccess, setMyAccess] = React.useState(false);

 const [errorAlert, setErrorAlert] = React.useState("");
 const [openAlert, setOpenAlert] = React.useState(false);
 const [openDelete, setOpenDelete] = React.useState({
  flag: false,
  post: null,
 });
 const [snackbarAlert, setSnackbarAlert] = React.useState(false);
 const [openSnackbar, setOpenSnackbar] = React.useState(false);
 const [openEdit, setOpenEdit] = React.useState([false, null]);
 const [refresh, setRefresh] = React.useState({
  admissions: 0,
  branches: 0,
 });

 const [loadingAfterBranch, setLoadingAfterBranch] = React.useState(true);

 const AdmissionFormsButtons = ({ post }) => (
  <>
   <IconButton
    aria-label="edit"
    sx={{ marginLeft: "auto", marginTop: -1 }}
    size="small"
    color="primary"
    onClick={() => {
     setOpenEdit([true, post]);
    }}
   >
    <EditIcon />
   </IconButton>
   <IconButton
    aria-label="delete"
    sx={{ marginTop: -1 }}
    size="small"
    color="error"
    onClick={() => {
     setOpenDelete({
      flag: true,
      post,
     });
    }}
   >
    <Delete />
   </IconButton>
  </>
 );

 useEffectForFirebase(
  [refresh.admissions],
  () => {
   $firebase_database_read(
    `websites/${branch}/admissions/apply/`,
    async (data) => {
     if (data) {
      data = Object.entries(data);
      setAdmissionForms(data);
     } else {
      setAdmissionForms([]);
     }
    },
    (e) => {
     setErrorAlert(e);
     setOpenAlert(true);
    }
   );
  },
  () => {
   setAdmissionForms(false);
  }
 );
 useEffectForFirebase(
  [, branches],
  (user) => {
   let data = branches.branches,
    data0 = branches.myAccess;
   if (data0) {
    data0.map((d) => {
     if (d[0] === user.email) {
      if (d[1] === "full") {
       setBranch(getBranch || Object.keys(data)[0]);
       setMyAccess("full");
      } else {
       setMyAccess(d[1]), setBranch(d[1][0]);
      }
     }
    });
   } else {
    setBranch(getBranch || Object.keys(data)[0]);
   }
   setRefresh((rf) => {
    return {
     admissions: rf.admissions + 1,
    };
   });
  },
  () => {
   setMyAccess(false);
  }
 );
 React.useEffect(() => {
  if (admissionForms) {
   setLoadingAfterBranch(false);
  } else {
   setLoadingAfterBranch(true);
  }
 }, [branch, admissionForms]);

 return (
  <>
   <Navbar auth={auth} />
   {auth && (
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
     <Modal
      title="Delete"
      submitButton="Delete"
      body="Are you sure you want to delete this form? This action cannot be undone."
      isOpen={openDelete.flag}
      onCancel={() => {
       setOpenDelete({
        flag: false,
        post: null,
       });
      }}
      onSubmit={() => {
       function deleteNotice() {
        $firebase_database_delete(
         `websites/${branch}/admissions/${openDelete.post.id}`,
         () => {
          setOpenSnackbar(true);
          setSnackbarAlert("Permanently deleted.");
         },
         (e) => {
          setErrorAlert(e);
          setOpenAlert(true);
         }
        );
       }
       deleteNotice();
       setOpenDelete({
        flag: false,
        post: null,
       });
       setRefresh((rf) => {
        return {
         admissions: rf.admissions + 1,
        };
       });
      }}
     />
     <Alert
      color={
       (snackbarAlert &&
       snackbarAlert
        .toLowerCase()
        .match(
         /(error|sorry|unsuccessful|failed|wrong|invalid|not found|deleted)/g
        )
        ? "error"
        : false) || false
      }
      body={snackbarAlert}
      isOpen={openSnackbar}
      onCancel={() => {
       setOpenSnackbar(false);
       setSnackbarAlert("");
      }}
     />
     <Edit
      isOpen={openEdit[0]}
      type="notice"
      post={openEdit[1]}
      onCancel={() => {
       setOpenEdit(false, null);
      }}
      onEdited={() => {
       setOpenSnackbar(true);
       setSnackbarAlert("Successfully edited.");
       setRefresh((rf) => {
        return {
         admissions: rf.admissions + 1,
        };
       });
      }}
     />
     <div className="admissions">
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
         Admissions
         <Button
          sx={{ marginLeft: "auto" }}
          size="small"
          variant="outlined"
          onClick={() => {
           setRefresh((rf) => {
            return {
             admissions: rf.admissions + 1,
            };
           });
           setLoadingAfterBranch(true);
          }}
         >
          Refresh
         </Button>
        </h2>
        <FormControl>
         <Typography
          variant="p"
          style={{ paddingBottom: "0.2rem" }}
          color={"text.secondary"}
          sx={{
           fontSize: "0.8rem",
          }}
         >
          Select Branch
         </Typography>
         <Select
          id="branch-select"
          value={branch}
          label="Branch"
          variant="standard"
          onChange={(e) => {
           function a() {
            setAdmissionForms(false);
            setBranch(e.target.value);
            window.localStorage.setItem(
             "admin.mumodel.info-branch",
             e.target.value
            );
            setLoadingAfterBranch(true);
            setRefresh((rf) => {
             return {
              admissions: rf.admissions + 1,
             };
            });
           }
           if (myAccess && Array.isArray(myAccess)) {
            if (myAccess.includes(e.target.value)) {
             a();
            } else {
             setErrorAlert(
              "You don't have access to this branch: " + e.target.value
             );
             setOpenAlert(true);
            }
           } else if (!myAccess || myAccess == "full") {
            a();
           }
          }}
         >
          {branches.branches.length !== 0 ? (
           Object.entries(branches.branches).map(([b, i]) => (
            <MenuItem value={b}>{i.name}</MenuItem>
           ))
          ) : (
           <MenuItem>Loading ...</MenuItem>
          )}
         </Select>
        </FormControl>
        <br />
        <a href="https://www.mumodel.info/" target="_blank">
         <Button
          variant="contained"
          style={{ marginTop: "1rem" }}
          startIcon={<WebOutlined />}
         >
          Visit Website to Apply
         </Button>
        </a>
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
         <form
          style={{ display: "flex", alignItems: "center" }}
          action="/admissions/application/"
         >
          <TextField
           variant="filled"
           label="Application Form"
           name="q"
           size="small"
           sx={{
            width: "100%",
            maxWidth: "300px",
           }}
           placeholder="Form ID"
          />
          <input type="hidden" name="b" value={branch} readOnly={true} />
          <Button
           variant="contained"
           sx={{ ml: 2, py: 1 }}
           color="primary"
           type="submit"
          >
           Search
          </Button>
         </form>
         <Paper sx={{ mt: 2, p: 2, minHeight: "200px" }}>
          <p
           style={{
            color: "gray",
            fontSize: "0.9rem",
           }}
          >
           No search results found.
          </p>
         </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
         <Typography variant="h6" style={{ paddingBottom: "0.2rem" }}>
          All Admissions
         </Typography>
         {!admissionForms ? (
          <div
           style={{
            display: loadingAfterBranch ? "block" : "none",
           }}
          >
           <CircularProgress
            size={30}
            sx={{
             mt: 2,
            }}
           />
          </div>
         ) : admissionForms.length === 0 ? (
          <p
           style={{
            paddingTop: "1rem",
            color: "#666",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
           }}
          >
           <ReportProblemIcon color="disabled" />
           <Typography
            variant="p"
            sx={{
             ml: 1,
            }}
           >
            No application yet!
           </Typography>
          </p>
         ) : (
          admissionForms
           .sort(
            ([k, a], [p, b]) =>
             new Date(b.date).getTime() - new Date(a.date).getTime()
           )
           .map(([p, i]) => {
            return (
             i && (
              <Card sx={{ marginTop: 2, padding: 2 }} elevation={1}>
               <h4>{p}</h4>
               <p style={{ color: "gray", fontSize: "0.93rem" }}>
                {i.apply_mobile}
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
                  label={new Date(i.date).toDateString()}
                  size="small"
                  sx={{ marginRight: "0.3rem" }}
                 />
                 <Chip
                  label={i.class}
                  size="small"
                  sx={{
                   display: !i.class && "none",
                   marginRight: "0.3rem",
                  }}
                 />
                 <Chip
                  label={i.division}
                  size="small"
                  sx={{
                   display: !i.division && "none",
                  }}
                 />
                </p>
               </div>
              </Card>
             )
            );
           })
         )}
        </Grid>
       </Grid>
      </Container>
     </div>
    </>
   )}
  </>
 );
}
