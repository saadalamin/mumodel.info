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
import { Delete } from "@mui/icons-material";

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
 $firebase_database_write,
} from "./../utils/firebase";
import { getDownloadURL } from "@firebase/storage";
import { ref, set, push, refFromURL } from "@firebase/database";

export default function Edit({
 isOpen,
 onCancel,
 type = "post",
 onEdited,
 post = {},
}) {
 const [showLoading, setShowLoading] = React.useState(false);
 const [open, setOpen] = React.useState(false);
 const [submitDisabled, setSubmitDisabled] = React.useState(true);
 const [uploadingDisabled, setUploadingDisabled] = React.useState(false);
 const [tabValue, setTabValue] = React.useState("1");
 const [tags, setTags] = React.useState([]);
 const [author, setAuthor] = React.useState("");
 const [title, setTitle] = React.useState("");
 const [body, setBody] = React.useState("");
 const [date, setDate] = React.useState("");
 const [image, setImage] = React.useState(false);
 const [imageObj, setImageObj] = React.useState(false);
 const [imageURL, setImageURL] = React.useState(false);
 const [errMsg, setErrMsg] = React.useState("");

 const handlingFileElements = (
  <>
   <Button
    id="fileMain"
    component="label"
    variant="contained"
    startIcon={<CloudUploadIcon />}
    disabled={uploadingDisabled}
    sx={{
     margin: "0 1rem 1rem 0",
    }}
    onClick={() => {
     if (image !== imageURL) {
      handleUpload();
     }
    }}
   >
    <div style={{ display: image !== imageURL && "none" }}>
     Upload new image
     <VisuallyHiddenInput
      id="file"
      type="file"
      accept="image/*"
      disabled={image !== imageURL && true}
      onChange={(e) =>
       setImage(
        URL.createObjectURL(e.target.files[0]),
        setImageObj(e.target.files[0])
       )
      }
     />
    </div>
    <div style={{ display: image === imageURL && "none" }}>Upload now</div>
   </Button>
   <Button
    id="deleteImgBtn"
    component="label"
    variant="contained"
    color="error"
    startIcon={<Delete />}
    sx={{
     marginBottom: "1rem",
     display: post?.picture || post?.noticeLink ? "" : "none",
    }}
    disabled={uploadingDisabled}
    onClick={() => {
     if (image !== imageURL) {
      setImage(imageURL);
     } else {
      setUploadingDisabled(true);
      setSubmitDisabled(true);
      let brnch = window.localStorage.getItem("admin.mumodel.info-branch"),
       rf = `websites/${brnch}/${type === "notice" ? "notices" : "posts"}/${
        post.id
       }`;
      $firebase_database_write(
       rf,
       {
        ...post,
        picture: null,
        noticeLink: null,
       },
       () => {
        return true;
       },
       () => {
        return false;
       }
      );
      function o() {
       setImage(null);
       setImageURL(null);
       setUploadingDisabled(false);
       document.getElementById("fileMain").style.display = "";
      }
      $firebase_storage_delete(
       `${
        type === "notice" ? "notices" : "posts"
       }/${brnch}/${decodeURIComponent(
        imageURL
         .replace(
          "https://firebasestorage.googleapis.com/v0/b/specialstars-dev.appspot.com/o/posts%2F",
          ""
         )
         .replace("?alt=media", "")
         .replace(/&token=[a-zA-Z0-9-_.]+&?/g, "")
       )}`,
       () => {
        o();
       },
       () => {
        o();
       }
      );
      setShowLoading(true);
      setSubmitDisabled(true);
      setTimeout(() => {
       setShowLoading(false);
       setSubmitDisabled(false);
       setOpen(false);
       onCancel(open);
       clearForm();
       onEdited();
      }, 1000);
     }
    }}
   >
    {image === imageURL ? "Delete the image" : "Discard change"}
   </Button>
  </>
 );

 const updateThePost = () => {
  let updatedPost = {
   id: post.id,
   title: title,
   body: body.replaceAll(/\n/g, "\\n") || null,
   tags: (typeof tags == "string" ? tags.split(", ") : tags) || [],
   picture: imageURL || null,
   author: author || "Admin",
   type: type,
   date: post.date || null,
  };
  if (type === "notice") {
   updatedPost = {
    ...updatedPost,
    author: null,
    picture: null,
    tags: null,
    date: date || null,
    publishedDate: post.publishedDate || null,
    noticeLink: imageURL || null,
   };
  }
  let brnch = window.localStorage.getItem("admin.mumodel.info-branch"),
   rf = `websites/${brnch}/${type === "notice" ? "notices" : "posts"}/${
    post.id
   }`;
  $firebase_database_write(
   rf,
   updatedPost,
   () => {
    onEdited();
   },
   () => {
    setOpen(false);
    onCancel(open);
   }
  );
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
  setImageURL(false);
  setUploadingDisabled(false);
  setSubmitDisabled(true);
  setTabValue("1");
 };

 const handleClose = (e, reason) => {
  function o() {
   setOpen(false);
   onCancel(open);
   clearForm();
   setTabValue("1");
  }
  if (reason === "backdropClick") return;
  o();
 };

 const handleUpload = () => {
  if (!imageObj) return;
  setUploadingDisabled(true);
  setSubmitDisabled(true);
  let brnch = window.localStorage.getItem("admin.mumodel.info-branch");
  $firebase_storage_upload(
   `${type === "notice" ? "notices" : "posts"}/${brnch}/${imageObj.name}`,
   imageObj,
   (k) => {
    k.then((snapshot) => {
     getDownloadURL(snapshot.ref).then((downloadURL) => {
      setImageURL(downloadURL);
      setImage(downloadURL);
      setUploadingDisabled(false);
      document.getElementById("fileMain").style.display = "none";
      let brnch = window.localStorage.getItem("admin.mumodel.info-branch"),
       rf = `websites/${brnch}/${type === "notice" ? "notices" : "posts"}/${
        post.id
       }`;
      let imgurl = {
       picture: downloadURL,
      };
      if (type === "notice") {
       imgurl = {
        noticeLink: downloadURL,
       };
      }
      $firebase_database_write(
       rf,
       {
        ...post,
        ...imgurl,
       },
       () => {
        onEdited();
       },
       () => {
        setOpen(false);
        onCancel(open);
       }
      );
      setShowLoading(true);
      setSubmitDisabled(true);
      setTimeout(() => {
       setShowLoading(false);
       setSubmitDisabled(false);
       setOpen(false);
       onCancel(open);
       clearForm();
      }, 1000);
     });
    }).catch((error) => {
     return false;
    });
    return false;
   }
  );
 };

 const handleConfirm = (e) => {
  let x = checkRequiredFields();
  if (x !== true) {
   e.preventDefault();
   setErrMsg("* " + x);
   return;
  } else setErrMsg("");
  if (submitDisabled === false) {
   updateThePost();
   setShowLoading(true);
   setSubmitDisabled(true);
   setTimeout(() => {
    setShowLoading(false);
    setSubmitDisabled(false);
    setOpen(false);
    onCancel(open);
    clearForm();
   }, 1000);
  }
 };

 React.useEffect(() => {
  setOpen(isOpen);
  setErrMsg("");
 }, [isOpen]);

 React.useEffect(() => {
  if (post) {
   let a = post.title,
    b = post.body,
    c = post.tags,
    d = post.author || "Admin",
    e = post.picture,
    f = post.date;
   if (a) setTitle(a);
   if (b)
    setBody(
     /* Cautions: this (``) will produce line break, so don't remove or rearrange this */
     b.replaceAll(
      "\\n",
      `
`
     )
     /* End */
    );
   if (b) if (c) setTags(typeof c == "string" ? c : c.join(", "));
   if (d) setAuthor(d);
   if (e) setImage(e), setImageURL(e);
   if (type === "notice" && post.noticeLink) {
    setImage(post.noticeLink);
    setImageURL(post.noticeLink);
    if (f) setDate(f);
   }
  }
  console.log(image, imageURL);
 }, [post]);

 React.useEffect(() => {
  let flag = true;
  if (post) {
   function o(p) {
    setSubmitDisabled(p);
   }
   function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
     if (a[i] !== b[i]) return false;
    }
    return true;
   }
   if (
    (title && title !== post.title) ||
    (body && body.replaceAll(/\n/g, "\\n") !== post.body)
   ) {
    flag = false;
   } else if (
    (post.tags && !arraysEqual(post.tags, tags.split(", "))) ||
    (!post.tags && tags.length > 0) ||
    (post.author && author && post.author !== author)
   ) {
    flag = false;
   } else if (type === "notice") {
    if (image !== post.noticeLink) {
     flag = false;
    }
    if (date !== post.date) {
     flag = false;
    }
   }
   o(flag);
  }
 }, [title, body, tags, author, image, date]);

 return (
  <div>
   <Dialog open={open} onClose={handleClose} transitionDuration={0}>
    <DialogTitle>
     Edit {type.charAt(0).toUpperCase() + type.slice(1)}
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
          fullWidth
          variant="outlined"
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
         <div
          style={{
           minWidth: "300px",
           minHeight: "200px",
          }}
         >
          <embed
           src={image !== false ? image : "https://via.placeholder.com/300x200"}
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
         </div>
         <div
          style={{
           display: type === "notice" ? "" : "none",
          }}
         >
          {handlingFileElements}
         </div>
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
          <label
           htmlFor="date"
           style={{
            display: "block",
            marginBottom: "0rem",
            fontSize: "0.8rem",
            color: "grey",
           }}
          >
           Date
          </label>
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
          {handlingFileElements}
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
     <Button onClick={handleClose}>Discard</Button>
     <Button
      type="submit"
      onClick={handleConfirm}
      id="submitButton"
      disabled={submitDisabled}
     >
      {type === "notice" ? "Update the notice" : "Update the post"}
     </Button>
    </DialogActions>
   </Dialog>
  </div>
 );
}
