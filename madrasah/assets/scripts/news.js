import app from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);
const postRef = ref(db, "websites/mumm/posts/");

window.onload = async () => {
  let posts = [];
  function writeposts() {
    let postsElm = document.getElementById("posts");
    if (postsElm) {
      let snippet = "";
      Object.entries(posts).map(([p, n]) => {
        snippet += `<div class="col-md-6 col-lg-4"><div class="card bg-light post h-100">
        ${
          n.picture
            ? `<img class="card-img-top" src="${n.picture}" style="height: 100%; object-fit: cover;">`
            : ""
        }
        <div class="card-body">
            <h5 class="card-title" style="font-family: ${
              n.title.match(/[^\x00-\x7F]/)
                ? "'Hind Siliguri', sans-serif; font-weight: 500"
                : "'Roboto', sans-serif;"
            }">${n.title}</h5>
            <p class="card-text" style="font-family: ${
              n.body.match(/[^\x00-\x7F]/) ? "'Hind Siliguri'" : "'Montserrat'"
            }, sans-serif;">${n.body}</p>
            <a href="${
              n.link || "#"
            }" class="btn btn-primary btn-sm">Read More</a>
        </div>
        </div></div>`;
      });
      postsElm.innerHTML = snippet;
    }
  }
  await onValue(postRef, (s) => {
    posts = s.val();
    if (!posts) posts = [{ title: "No post found!" }];
    writeposts();
  });
};
