import app from "./firebase.js";
import {
 getDatabase,
 ref,
 onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);
const noticeRef = ref(db, "websites/mumm/notices/");

window.onload = () => {
 let notices = [];
 function writeNotices() {
  let noticesElm = document.getElementById("notices");
  if (noticesElm) {
   let snippet = "";
   Object.entries(notices).map(([p, n]) => {
    snippet += `<li class="list-group-item d-auto d-md-flex notice"><span class="me-3 bg-primary-subtle p-1 px-2">${n.publishedDate || ""}</span><p class="p-0 mt-2 mt-md-0">${n.title}</p><div class="ms-auto ${!n.pdfLink && "d-none"}"><a class="btn px-2 py-1 bg-success-subtle" style="font-size: 0.9rem;text-decoration:none;color:inherit" href="${n.pdfLink}">Download</a></div></li>`;
   });
   noticesElm.innerHTML = snippet;
  }
 }
 onValue(noticeRef, (s) => {
  notices = s.val();
  if(!notices) notices = [{title:"No notice found!"}];
  writeNotices();
 });
};
