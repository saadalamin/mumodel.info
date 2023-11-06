import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDR5TFN_Rqx7olcPe5F6sVWOwmnBkeFZig",
  authDomain: "mumm-dev.firebaseapp.com",
  databaseURL:
    "https://mumm-dev-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mumm-dev",
  storageBucket: "mumm-dev.appspot.com",
  messagingSenderId: "222218119026",
  appId: "1:222218119026:web:9ed6ba97511145be5a9feb",
};

export default initializeApp(firebaseConfig);