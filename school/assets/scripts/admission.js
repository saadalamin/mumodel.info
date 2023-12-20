let localStorageName = "mumodel-mums-applicationForAdmission";
const modalAdmission = new bootstrap.Modal("#modalAdmission");
const modalAdmissionSave = new bootstrap.Modal("#modalAdmissionSave");

function clearForm() {
  let form = document.querySelector("#admissionForm .form");
  for (let i = 0; i < form.length; i++) {
    if (form[i].tagName == "INPUT") {
      form[i].value = "";
    }
  }
  document.getElementById("admissionPhoto").src =
    "assets/images/admission-photosample.png";
  document.getElementById("admissionClass").value = "প্লে";
  document.getElementById("admissionAcademicYear").value = "";
  document.getElementById("date").value = "";
  document.querySelectorAll(".division").forEach(function (e) {
    e.checked = false;
  });
  localStorage.removeItem(localStorageName);
}

function submitAlert() {
  modalAdmissionSave.show();
  modalAdmission.hide();
  document
    .getElementById("modalAdmissionSave")
    .addEventListener("hidden.bs.modal", function (event) {
      modalAdmission.show();
    });
}

function saveFormToBrowser() {
  let form = document.querySelector("#admissionForm .form");
  let data = {};
  setTimeout(function () {
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
    data["photo"] = document.getElementById("admissionPhoto").src;
    document.querySelectorAll(".division").forEach(function (e) {
      if (e.checked) data["division"] = e.value;
    });
    document.getElementById("admissionClass").value = document.getElementById(
      "admissionClassSelect"
    ).value;
    data["class"] = document.getElementById("admissionClass").value;
    data["academic_year"] = document.getElementById(
      "admissionAcademicYear"
    ).value;
    data["date"] = document.getElementById("date").value;

    localStorage.setItem(localStorageName, JSON.stringify(data));
  }, 10);
}

function printForm() {
  if (
    !document.getElementById("date").value ||
    !document.getElementById("birthDate").value
  ) {
    document.getElementById("date").type = "text";
    document.getElementById("birthDate").type = "text";
  }
  document.getElementById("admissionClassSelect").style.display = "none";
  document.getElementById("admissionClass").style.display = "block";
  document.getElementById("admissionClass").value = document.getElementById(
    "admissionClassSelect"
  ).value;
  printJS({
    printable: "admissionForm",
    type: "html",
    ignoreElements: ["admissionPhotoUpload", "printButton"],
    onPrintDialogClose: function () {
      document.getElementById("date").type = "date";
      document.getElementById("birthDate").type = "date";
      document.getElementById("admissionClassSelect").style.display = "block";
      document.getElementById("admissionClass").style.display = "none";
    },
    css: [
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    ],
  });
}

function admissionFormOpen() {
  document
    .getElementById("modalAdmission")
    .addEventListener("hidden.bs.modal", function (event) {
      window.location.hash = "";
    });
  document
    .getElementById("modalAdmission")
    .addEventListener("shown.bs.modal", function (event) {
      window.location.hash = "#application";
    });
  modalAdmission.show();
}

window.onload = function () {
  if (window.location.hash.includes("#application")) admissionFormOpen();
  document.querySelectorAll(".division").forEach(function (e) {
    e.checked = false;
  });
  document.getElementById("date").valueAsDate = new Date();
  document.getElementById("admissionAcademicYear").value =
    new Date().getFullYear() + 1 + " - " + (new Date().getFullYear() + 2);
  if (localStorage.getItem(localStorageName)) {
    let data = JSON.parse(localStorage.getItem(localStorageName));
    for (let i in data) {
      if (data[i] == undefined) data[i] = "";
    }
    let form = document.querySelector("#admissionForm .form");
    for (let i = 0; i < form.length; i++) {
      if (form[i].tagName == "INPUT") {
        let n = form[i].placeholder
          .replace(/ /g, "_")
          .replace(/'s/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "");
        form[i].value = data[n];
      }
    }
    if (data["photo"])
      document.getElementById("admissionPhoto").src = data["photo"];
    document.querySelectorAll(".division").forEach(function (e) {
      if (e.value == data["division"]) e.checked = true;
      else e.checked = false;
    });
    document.getElementById("admissionClass").value = data["class"];
    document.getElementById("admissionAcademicYear").value =
      data["academic_year"];
    document.getElementById("date").value = data["date"];
  }
};
