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
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);

document.getElementById("saveFormToServerInput").onkeydown = function (e) {
 if (e.key == "Enter") {
  let form = document.querySelector("#admissionForm .form");
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
  let mobile = document.querySelector(
   '#saveToServer input[type="number"]'
  ).value;
  if (mobile.length < 11) {
   alert("Invalid mobile number");
   return;
  }

  let ref = dbRef(db, "admissions/applications/" + mobile);
  set(ref, data)
   .then(() => {
    alert("Admission form submitted successfully");
    modalAdmission.hide();
    modalAdmissionSave.hide();
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
  alert(
   "Please fill all the required fields: " +
    missing
     .join(", ")
     .replace(/_/g, " ")
     .replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
     })
  );
  return false;
 }
 return true;
}
