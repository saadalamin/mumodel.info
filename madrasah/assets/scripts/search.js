import app from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const db = getDatabase(app);

window.onload = async () => {
  let postQuery = new URLSearchParams(window.location.search).get("post");
  let noticeQuery = new URLSearchParams(window.location.search).get("notice");
  if (postQuery) {
    let post = {};
    await onValue(ref(db, "websites/mumm/posts/" + postQuery), (s) => {
      post = s.val();
      if (!post) post = { title: "No post found!" };
      let postsElm = document.getElementById("post");
      if (postsElm) {
        postsElm.innerHTML = `<h2 class="card-title mb-2" style="font-family: ${
          post.title.match(/[^\x00-\x7F]/)
            ? "'Hind Siliguri', sans-serif; font-weight: 500"
            : "'Roboto', sans-serif;"
        }">${post.title}</h2>
        <p class="card-text text-muted mb-4" style="font-family: 'Open Sans', sans-serif; font-size: 0.8rem">Created on ${
          post.date
        }</p>
        <div class="card-img-top bg-dark-subtle" style="min-height: 300px;">
        ${
          post.picture
            ? `<img class="card-img-top" src="${post.picture}" style="height: 100%; object-fit: cover;">`
            : ""
        }
        </div>
        <div class="card-body py-4 d-flex flex-column justify-content-between gap-3">
          <div>
            <p class="card-text mt-3" style="font-family: ${
              post.body.match(/[^\x00-\x7F]/) ? "'Hind Siliguri'" : "'Roboto'"
            }, sans-serif; line-height: 1.85">${post.body?.replaceAll("\\n", "<br/>")}</p>

            <div class="d-flex flex-wrap gap-2 mt-5">
                ${
                  post.tags
                    ? post.tags
                        .map(
                          (tag) =>
                            `<a href="/search?tag=${tag}" class="btn btn-sm btn-light border" style="font-family: 'Open Sans', sans-serif";>${tag}</a>`
                        )
                        .join("")
                    : ""
                }
            </div>
          </div>
        </div>`;
      }
    });
  }
  if (noticeQuery) {
    let n = {};
    await onValue(ref(db, "websites/mumm/notices/" + noticeQuery), (s) => {
      n = s.val();
      if (!n) n = { title: "No notice found!" };
      let noticeElm = document.getElementById("notice");
      if (noticeElm) {
        let date = new Date(n.date || n.publishedDate);
        let month = date.toLocaleString("default", { month: "short" });
        let day = date.getDate();
        let dayName = date.toLocaleString("default", { weekday: "short" });
        noticeElm.innerHTML = `
        <div class="mb-3 bg-white text-center" style="font-size: 0.8rem; width: min-content; text-transform: uppercase;">${
          date &&
          `<span class="d-block bg-danger text-white p-2 py-0" style="border-radius: 0.25rem 0.25rem 0 0;">${month}</span><span class="d-block p-2 py-0">${day}</span><span class="d-block bg-dark-subtle p-2 py-0" style="border-radius: 0 0 0.25rem 0.25rem; font-size: 0.67rem;">${dayName}</span>`
        }</div><div>
          <h4 class="p-0 lh-1">${n.title}</h4>
          <p class="p-0 text-muted" style="font-size: 0.8rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-clock-fill" viewBox="0 0 18 18">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
    </svg> Published: ${n.publishedDate}</p>
          <p class="py-3" style="font-family: ${
            n.body && n.body.match(/[^\x00-\x7F]/)
              ? "'Hind Siliguri', sans-serif; font-weight: 500"
              : "'Roboto', sans-serif;"
          }">${n.body?.replaceAll("\\n", "<br/>") || ""}</p>
          ${n.noticeLink ? `<embed src="${n.noticeLink}" width="100%" ${
          n.noticeLink.match(/\.pdf$/) ? 'height="500px"' : ""
        }
           style="object-fit: cover; object-position: center center; border: 1px dashed grey; margin-bottom: 1rem; display: block;"/>`:""}
          </div>`;
      }
    });
  }
};
