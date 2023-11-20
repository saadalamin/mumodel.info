import app from "./firebase.js";
import {
 ref as stRef,
 uploadBytes,
 getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import {
 getDatabase,
 ref as dbRef,
 set,
 push,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);
const alertBox = document.getElementById("alertBox");

document.getElementById("submitFormInput").onkeydown = function (e) {
 if (e.key == "Enter") {
  alertBox.innerHTML = "<span class='text-muted'>Please wait...</span>";
  const form = document.querySelector("#admissionForm .form");
  let data = {};
  for (let i = 0; i < form.length; i++) {
   if (form[i].tagName == "INPUT") {
    let n = form[i].placeholder
     .replace(/ /g, "_")
     .replace(/'s/g, "")
     .toLowerCase()
     .replace(/[^a-z0-9_]/g, "");
    data[n] = form[i].value;
   }
  }
  if (
   !document.getElementById("admissionPhoto").src.includes("assets/images/")
  ) {
   data["photo"] = document.getElementById("admissionPhoto").src;
  }
  document.querySelectorAll(".division").forEach(function (e) {
   if (e.checked) data["division"] = e.name;
  });
  document.getElementById("admissionClass").value = document.getElementById(
   "admissionClassSelect"
  ).value;
  data["class"] = document.getElementById("admissionClass").value;
  data["academic_year"] = document.getElementById(
   "admissionAcademicYear"
  ).value;
  data["date"] = document.getElementById("date").value;
  if (!validateForm(data)) return;
  alertBox.innerHTML = "";
  let mobile =
   "880" + document.querySelector('#submit input[type="number"]').value;
  if (mobile.length < 10) {
   alertBox.innerHTML = "<span style='color: red'>Invalid mobile number</span>";
   return;
  }
  data["apply_mobile"] = mobile;
  let ref = push(dbRef(db, "admissions/apply/"));
  let id = ref.key.replace(/-/g, "").replace(/_/g, "");
  data["id"] = id;
  set(dbRef(db, "admissions/apply/" + id), data)
   .then(() => {
    document.getElementById("submitFormInput").disabled = true;
    alertBox.innerHTML =
     "<span style='color:green'>Admission form submitted successfully!<br/>Your application number is <span style='color: black'>" +
     id +
     "</span></span>";
    clearForm();
   })
   .catch((e) => {
    alert("Error: " + e);
   });
 }
};

function validateForm(data) {
 let required = [
  "date",
  "date_of_birth",
  "student_name_bangla",
  "student_name_english",
  "father_name_bangla",
  "father_name_english",
  "mother_name_bangla",
  "mother_name_english",
  "occupation_father",
  "occupation_mother",
  "current_address",
  "district_current",
  "post_current",
  "thana_current",
  "permanent_address",
  "district_permanent",
  "post_permanent",
  "thana_permanent",
  "mobile_number_father",
  "mobile_number_mother",
  "previous_institution_name",
  "class_previous",
  "division",
  "class",
  "academic_year",
 ];
 let missing = [];
 required.forEach(function (r) {
  if (!data[r]) missing.push(r);
 });
 if (missing.length > 0) {
  alertBox.innerHTML =
   "<span style='color: red'>Please fill all the required fields:<br/><ul>" +
   missing
    .map(function (m) {
     return m
      .replace(/_/g, " ")
      .replace(/(^\w|\s\w)/g, function (m) {
       return m.toUpperCase();
      })
      .replace(/(^|\n)/g, "$1<li>");
    })
    .join("") +
   "</ul></span>";
  return false;
 }
 return true;
}
