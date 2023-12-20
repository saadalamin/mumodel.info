import app from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);

window.onload = async () => {
  if (new URLSearchParams(window.location.search).get("tab") == "faculty") {
    const facultyContainer = document.getElementById("faculty-container");
    onValue(ref(db, "websites/mumm/academics/faculty"), (data) => {
      if (data) {
        const faculty = data.val();
        let facultyHTML = "";
        for (const key in faculty) {
          const facultyMember = faculty[key];
          facultyHTML += `
          <li class="list-group-item col-6 col-md-4 col-lg-3">
              <img src="${facultyMember.image || "assets/images/faculty/profile.webp"}" />
              <div class="item">
                <p>${facultyMember.name}</p>
                <span>${facultyMember.designation}</span>
              </div>
          </li>
        `;
        }
        facultyContainer.innerHTML = facultyHTML;
      }
    });
  }
};
