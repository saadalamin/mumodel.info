import React from "react";

/* Components */
import Navbar from "../components/Navbar";
import Create from "../components/Create";
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
import {
 Edit as EditIcon,
 Pending,
 PostAddOutlined,
} from "@mui/icons-material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

/* Utils */
import {
 $firebase_database_delete,
 $firebase_database_read,
} from "../utils/firebase";
import useEffectForFirebase from "../utils/useEffectFirebase";

export default function Notices({ branches, auth }) {
 let getBranch = window.localStorage.getItem("admin.mumodel.info-branch");

 /*** FIREBASE ***/
 const [notices, setNotices] = React.useState(false);
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
 const [isOpenCreateNew, setIsOpenCreateNew] = React.useState(false);
 const [refresh, setRefresh] = React.useState({
  notices: 0,
  branches: 0,
 });

 const [loadingAfterBranch, setLoadingAfterBranch] = React.useState(true);

 const NoticesButtons = ({ post }) => (
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
  [refresh.notices],
  () => {
   $firebase_database_read(
    `websites/${branch}/notices/`,
    async (data) => {
     if (data) {
      data = Object.entries(data);
      setNotices(data);
     } else {
      setNotices([]);
     }
    },
    (e) => {
     setErrorAlert(e);
     setOpenAlert(true);
    }
   );
  },
  () => {
   setNotices(false);
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
     notices: rf.notices + 1,
    };
   });
  },
  () => {
   setMyAccess(false);
  }
 );
 React.useEffect(() => {
  if (notices) {
   setLoadingAfterBranch(false);
  }
 }, [branch, notices]);

 return (
  <>
   <Navbar auth={auth} />
   {auth && (
    <>
     <div
      style={{
       width: "100%",
       height: "100%",
       position: "fixed",
       top: 0,
       left: 0,
       zIndex: 200,
       backgroundColor: "rgba(255,255,255,0.8)",
       display: loadingAfterBranch ? "block" : "none",
      }}
     >
      <CircularProgress
       sx={{
        position: "absolute",
        top: "calc(50% - 30px)",
        left: "calc(50% - 30px)",
       }}
       size={60}
      />
     </div>
     <Modal
      title="Notices"
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
      body="Are you sure you want to delete this notice? This action cannot be undone."
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
         `websites/${branch}/notices/${openDelete.post.id}`,
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
         notices: rf.notices + 1,
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
         notices: rf.notices + 1,
        };
       });
      }}
     />
     <Create
      isOpen={isOpenCreateNew}
      onCancel={() => {
       setIsOpenCreateNew(false);
      }}
      onCreated={() => {
       setIsOpenCreateNew(false);
       setRefresh((rf) => {
        return {
         notices: rf.notices + 1,
        };
       });
       setTimeout(() => {
        setOpenSnackbar(true);
        setSnackbarAlert("The notice has been successfully created.");
       }, 700);
      }}
      type="notice"
     />
     <div className="notices">
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
         Notices
         <Button
          sx={{ marginLeft: "auto" }}
          size="small"
          variant="outlined"
          onClick={() => {
           setRefresh((rf) => {
            return {
             notices: rf.notices + 1,
            };
           });
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
            setNotices(false);
            setBranch(e.target.value);
            window.localStorage.setItem(
             "admin.mumodel.info-branch",
             e.target.value
            );
            setLoadingAfterBranch(true);
            setRefresh((rf) => {
             return {
              notices: rf.notices + 1,
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
        <Button
         variant="contained"
         style={{ marginTop: "1rem" }}
         onClick={() => setIsOpenCreateNew(true)}
         startIcon={<PostAddOutlined />}
        >
         New Notice
        </Button>
       </Container>
      </Paper>
      <Container sx={{ marginTop: 4, marginBottom: 5 }}>
       <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
         <Typography variant="h6" style={{ paddingBottom: "0.2rem" }}>
          All Notices
         </Typography>
         {!notices ? (
          <p
           style={{
            paddingTop: "1rem",
            color: "#666",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
           }}
          >
           <Pending color="disabled" />
           <Typography
            variant="p"
            sx={{
             ml: 1,
            }}
           >
            Loading ...
           </Typography>
          </p>
         ) : notices.length === 0 ? (
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
            No notice yet!
           </Typography>
          </p>
         ) : (
          notices
           .sort(
            ([k, a], [p, b]) =>
             new Date(b.publishedDate).getTime() -
             new Date(a.publishedDate).getTime()
           )
           .slice(0, 10)
           .map(([i, p]) => {
            return (
             p && (
              <Card sx={{ marginTop: 2, padding: 2 }} elevation={1}>
               <h4>{p.title}</h4>
               <p
                style={{
                 color: "gray",
                 fontSize: "0.93rem",
                 padding: "0.66rem 0",
                }}
               >
                {p.body && p.body.substring(0, 200).replaceAll("\\n", " ")}
               </p>
               <p
                style={{
                 fontSize: "0.8rem",
                 display: "flex",
                }}
               >
                <Chip
                 label={new Date(p.publishedDate).toDateString()}
                 size="small"
                 sx={{ marginRight: "0.3rem" }}
                />
                <NoticesButtons post={p} />
               </p>
              </Card>
             )
            );
           })
         )}
        </Grid>
        <Grid item xs={12} md={6}></Grid>
       </Grid>
      </Container>
     </div>
    </>
   )}
  </>
 );
}
