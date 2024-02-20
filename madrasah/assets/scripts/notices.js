import app from "./firebase.js";
import {
 getDatabase,
 ref,
 onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);
const noticeRef = ref(db, "websites/mumm/notices/");

window.onload = async () => {
 let notices = [];
 function writeNotices() {
  let noticesElm = document.getElementById("notices");
  if (noticesElm) {
   let snippet = "";
   Object.entries(notices).map(([p, n]) => {
    if (!n.id) {
     snippet = `<li class="list-group-item d-flex notice">
      <p class="p-0 text-muted">
       No notice found!
      </p>
      </li>`;
    } else {
     let date = new Date(n.date || n.publishedDate);
     let month = date.toLocaleString("default", { month: "short" });
     let day = date.getDate();
     let dayName = date.toLocaleString("default", { weekday: "short" });
     snippet += `<li class="list-group-item d-flex notice"><div class="me-3 bg-white text-center" style="font-size: 0.8rem; width: min-content; text-transform: uppercase;">${
      date &&
      `<span class="d-block bg-danger text-white p-2 py-0" style="border-radius: 0.25rem 0.25rem 0 0;">${month}</span><span class="d-block p-2 py-0">${day}</span><span class="d-block bg-dark-subtle p-2 py-0" style="border-radius: 0 0 0.25rem 0.25rem; font-size: 0.67rem;">${dayName}</span>`
     }</div><div><p class="p-0 lh-1"><a href="search/?notice=${n.id}">${
      n.title
     }</a></p><p class="p-0 text-muted mt-2" style="font-size: 0.75rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-clock-fill" viewBox="0 0 18 18">
     <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
   </svg> Published: ${n.publishedDate}</p></div></li>`;
    }
    noticesElm.innerHTML = snippet;
   });
  }
 }
 await onValue(noticeRef, (s) => {
  notices = s.val();
  if (!notices) notices = [{ title: "No notice found!", id: null }];
  writeNotices();
 });
};
