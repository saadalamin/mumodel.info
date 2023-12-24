import app from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);
const postRef = ref(db, "websites/mums/posts/");

window.onload = async () => {
  let posts = [];
  function writeposts() {
    let postsElm = document.getElementById("posts");
    if (postsElm) {
      let snippet = "";
      Object.entries(posts).map(([p, n]) => {
        snippet += `<div class="col-md-6 col-lg-4 col-xxl-3"><div class="card bg-white post h-100">
        <div class="card-img-top bg-dark-subtle" style="min-height: 200px;">
        ${
          n.picture
            ? `<img class="card-img-top" src="${n.picture}" style="height: 100%; object-fit: cover;">`
            : ""
        }
        </div>
        <div class="card-body py-4 d-flex flex-column justify-content-between gap-3">
          <div>
            <h5 class="card-title mb-3" style="font-family: ${
              n.title.match(/[^\x00-\x7F]/)
                ? "'Hind Siliguri', sans-serif; font-weight: 500"
                : "'Roboto', sans-serif;"
            }">${n.title}</h5>
            <p class="card-text text-muted" style="font-size:0.9rem;font-family: ${
              n.body.match(/[^\x00-\x7F]/) ? "'Hind Siliguri'" : "'Roboto'"
            }, sans-serif; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 4;  line-clamp: 4; -webkit-box-orient: vertical;">${n.body}</p>
          </div>
          <a href="search/?post=${n.id}" class="btn btn-primary btn-sm">Read More</a>
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
