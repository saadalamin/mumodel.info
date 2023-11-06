import app from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);
const noticeRef = ref(db, "notices/");

window.onload = () => {
  let notices = [];
  function writeNotices() {
    let noticesElm = document.getElementById("notices");
    if (noticesElm) {
      let snippet = "";
      notices.map((n) => {
        snippet += `<li class="list-group-item d-block d-md-flex notice"><div class="me-3 bg-primary-subtle p-1 px-2">${n.publishedDate}</div><p class="p-0 mt-2 mt-md-0">${n.title}</p><div class="ms-auto"><a href="${n.pdfLink}" class="fs-5 border px-2 py-2 bg-success-subtle text-decoration-none">PDF</a></div></li>`;
      });
      noticesElm.innerHTML = snippet;
    }
  }
  onValue(noticeRef, (s) => {
    notices = s.val();
    writeNotices();
  });
};
