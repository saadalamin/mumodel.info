import React from "react";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";

const VisuallyHiddenInput = styled("input")({
 clip: "rect(0 0 0 0)",
 clipPath: "inset(50%)",
 height: 1,
 overflow: "hidden",
 position: "absolute",
 bottom: 0,
 left: 0,
 whiteSpace: "nowrap",
 width: 1,
});

import {
 $firebase_storage_upload,
 $firebase_storage_delete,
 $firebase_database_read,
 $firebase_database,
} from "../utils/firebase";
import { getDownloadURL } from "@firebase/storage";
import { ref, set, push } from "@firebase/database";

export default function Create({ isOpen, onCancel, type = "post", onCreated }) {
 const [showLoading, setShowLoading] = React.useState(false);
 const [open, setOpen] = React.useState(false);
 const [submitDisabled, setSubmitDisabled] = React.useState(false);
 const [tabValue, setTabValue] = React.useState("1");
 const [tags, setTags] = React.useState([]);
 const [author, setAuthor] = React.useState("");
 const [title, setTitle] = React.useState("");
 const [body, setBody] = React.useState("");
 const [date, setDate] = React.useState(null);
 const [image, setImage] = React.useState(false);
 const [imageURL, setImageURL] = React.useState(null);
 const [uploadStatus, setUploadStatus] = React.useState(null);
 const [errMsg, setErrMsg] = React.useState("");

 const submitPostToDB = () => {
  let uniqueId = push(ref($firebase_database, "posts/"))
   .key.replaceAll("-", "")
   .replaceAll("_", "");
  let post = {
   id: uniqueId,
   title: title,
   body: body.replaceAll(/\n/g, "\\n") || null,
   tags: tags || [],
   picture: imageURL || null,
   author: author || "Admin",
   date: new Date().toLocaleString(),
   type: type,
  };
  if (type === "notice") {
   post = {
    ...post,
    author: null,
    picture: null,
    tags: null,
    date: date || null,
    noticeLink: imageURL,
    publishedDate: new Date().toLocaleDateString("en-US", {
     month: "short",
     day: "numeric",
     year: "numeric",
    }),
   };
  }
  let brnch = window.localStorage.getItem("admin.mumodel.info-branch"),
   rf = `websites/${brnch}/${
    type === "notice" ? "notices" : "posts"
   }/${uniqueId}`;
  set(ref($firebase_database, rf), post);
  onCreated();
 };

 const checkRequiredFields = () => {
  let a = document.getElementById("name"),
   b = document.getElementById("body");
  if (title === "") {
   if (a) a.focus();
   return "Title is required";
  } else if (body === "" && type === "post") {
   if (b) b.focus();
   return "Body is required";
  } else if (type === "notice" && !image) {
   return "At Least One Image or PDF is required";
  } else {
   return true;
  }
 };

 const clearForm = () => {
  setTitle("");
  setBody("");
  setTags([]);
  setAuthor("");
  setImage(false);
  setImageURL(null);
  setUploadStatus(null);
 };

 const handleClose = (e, reason) => {
  function o() {
   setOpen(false);
   onCancel(open);
   clearForm();
   setTabValue("1");
  }
  if (reason === "backdropClick") return;
  if (image === false) {
   o();
  } else if (
   uploadStatus === "Upload the file" ||
   uploadStatus === "Upload the image"
  ) {
   o();
  } else if (
   uploadStatus === "Create the post" ||
   uploadStatus === "Create the notice"
  ) {
   $firebase_storage_delete(
    `posts/${document.getElementById("file").files[0].name}`,
    () => {
     o();
    },
    () => {
     o();
    }
   );
  }
 };

 const handleUpload = () => {
  if (imageURL === null) {
   let image = document.getElementById("file").files[0];
   setUploadStatus("Uploading ...");
   setSubmitDisabled(true);
   let brnch = window.localStorage.getItem("admin.mumodel.info-branch"),
    rf = `${type == "notice" ? "notices" : "posts"}/${brnch}/${image.name}`;
   $firebase_storage_upload(rf, image, (k) => {
    k.then((snapshot) => {
     getDownloadURL(snapshot.ref).then((downloadURL) => {
      setImageURL(downloadURL);
      setUploadStatus("Create the " + (type === "notice" ? "notice" : "post"));
      setSubmitDisabled(false);
      document.getElementById("fileMain").style.display = "none";
      return true;
     });
    }).catch((error) => {
     return false;
    });
    return false;
   });
  }
 };

 const handleConfirm = (e) => {
  let x = checkRequiredFields();
  if (x !== true) {
   e.preventDefault();
   setErrMsg("* " + x);
   return;
  } else setErrMsg("");
  if (image === false) {
   submitPostToDB();
   setShowLoading(true);
   setSubmitDisabled(true);
   setTimeout(() => {
    setShowLoading(false);
    setSubmitDisabled(false);
    setOpen(false);
    onCancel(open);
    clearForm();
   }, 2000);
  } else {
   if (handleUpload() === false) {
    clearForm();
   } else {
    if (
     uploadStatus === "Create the post" ||
     uploadStatus === "Create the notice"
    ) {
     submitPostToDB();
     setShowLoading(true);
     setSubmitDisabled(true);
     setTimeout(() => {
      setShowLoading(false);
      setSubmitDisabled(false);
      setOpen(false);
      onCancel(open);
      clearForm();
     }, 2000);
    } else if (uploadStatus === "Uploading ...") {
     e.preventDefault();
    }
   }
  }
 };

 React.useEffect(() => {
  setOpen(isOpen);
  setErrMsg("");
  setUploadStatus(`Create the ${type}`);
 }, [isOpen]);

 return (
  <div>
   <Dialog open={open} onClose={handleClose} transitionDuration={0}>
    <DialogTitle>
     New {type.charAt(0).toUpperCase() + type.slice(1)}
    </DialogTitle>
    <DialogContent>
     {showLoading ? (
      <div
       style={{
        minWidth: "300px",
        height: "100px",
        marginTop: "1rem",
       }}
      >
       <LinearProgress />
      </div>
     ) : (
      <>
       <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
         value={tabValue}
         onChange={(e, newValue) => {
          setTabValue(newValue);
         }}
        >
         <Tab label="Required" value="1" />
         <Tab label="Optional" value="2" />
        </Tabs>
       </Box>
       <br />
       <div
        style={{
         padding: "0 0.5rem",
        }}
       >
        <div
         style={{
          display: tabValue === "1" ? "block" : "none",
         }}
        >
         <TextField
          id="name"
          margin="dense"
          label="Title"
          type="text"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "1rem" }}
          placeholder="Type the title here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
         />
         <TextField
          margin="dense"
          id="body"
          label="Body"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={10}
          placeholder="Type something here"
          onChange={(e) => setBody(e.target.value)}
          value={body}
          sx={{ marginBottom: "1rem", display: type === "post" ? "" : "none" }}
         />
         <embed
          src={image !== false ? image : ""}
          width={300}
          height={200}
          style={{
           objectFit: "cover",
           objectPosition: "center",
           border: "1px dashed grey",
           marginBottom: "1rem",
           display: type === "notice" ? "block" : "none",
          }}
         />
         <Button
          id="fileMain"
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{
           marginBottom: "1rem",
           display: type === "notice" ? "" : "none",
          }}
         >
          Upload Image or PDF
          <VisuallyHiddenInput
           id="file"
           type="file"
           accept="image/*, application/pdf"
           onChange={(e) => {
            setImage(URL.createObjectURL(e.target.files[0]));
            setUploadStatus("Upload the file");
           }}
          />
         </Button>
        </div>
        <div
         style={{
          display: tabValue === "2" ? "block" : "none",
         }}
        >
         <div
          style={{
           display: type === "notice" ? "" : "none",
           marginBottom: "3rem",
          }}
         >
          <label htmlFor="date" style={
            {
                display: "block",
                marginBottom: "0rem",
                fontSize: "0.8rem",
                color: "grey"
            }
          }>Date</label>
          <TextField
           margin="dense"
           id="date"
           type="date"
           variant="standard"
           sx={{ marginBottom: "1rem" }}
           onChange={(e) => setDate(e.target.value)}
           value={date}
          />
          <TextField
           margin="dense"
           id="body"
           label="Body"
           type="text"
           fullWidth
           variant="outlined"
           multiline
           rows={10}
           placeholder="Type something here"
           onChange={(e) => setBody(e.target.value)}
           value={body}
           sx={{ marginBottom: "1rem", minWidth: "350px" }}
          />
         </div>
         <div
          style={{
           display: type !== "notice" ? "" : "none",
           marginBottom: "3rem",
          }}
         >
          <Box
           component="div"
           sx={{
            border: "1px dashed grey",
            width: "300px",
            height: "200px",
            marginBottom: "1rem",
           }}
          >
           <img
            src={
             image !== false ? image : "https://via.placeholder.com/300x200"
            }
            style={{
             width: "100%",
             height: "100%",
             objectFit: "cover",
             objectPosition: "center",
            }}
           />
          </Box>
          <Button
           id="fileMain"
           component="label"
           variant="contained"
           startIcon={<CloudUploadIcon />}
           sx={{
            marginBottom: "1rem",
           }}
          >
           Upload image
           <VisuallyHiddenInput
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
           />
          </Button>
          <Divider
           sx={{
            margin: "1rem 0",
           }}
          />
          <div style={{ display: "flex" }}>
           <TextField
            margin="dense"
            id="author"
            label="Author"
            type="text"
            variant="standard"
            sx={{ marginBottom: "1rem", marginRight: "0.7rem" }}
            placeholder="Enter the author name"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
           />
           <TextField
            margin="dense"
            id="tags"
            label="Tags"
            type="text"
            variant="standard"
            sx={{ marginBottom: "1rem" }}
            placeholder="Tag1, Tag2, Tag3"
            onChange={(e) => setTags(e.target.value.split(","))}
            value={Array.isArray(tags) ? tags.join(",") : tags}
           />
          </div>
         </div>
        </div>
       </div>
      </>
     )}
    </DialogContent>
    <p style={{ color: "red", width: "100%", padding: "0.5rem 2rem" }}>
     {errMsg}
    </p>
    <DialogActions>
     <Button onClick={handleClose} disabled={submitDisabled}>
      Discard
     </Button>
     <Button
      type="submit"
      onClick={handleConfirm}
      id="submitButton"
      disabled={submitDisabled}
     >
      {uploadStatus}
     </Button>
    </DialogActions>
   </Dialog>
  </div>
 );
}
