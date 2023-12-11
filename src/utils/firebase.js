/**
 * Firebase.js (v0.1.0)
 * @Created by Mohammad Sefatullah
 * @License: MIT
 */

import { initializeApp } from "@firebase/app";
import {
 getAuth,
 signInWithEmailAndPassword,
 signInWithPopup,
 GoogleAuthProvider,
 onAuthStateChanged,
 signOut,
 deleteUser,
} from "@firebase/auth";
import * as $fdb from "@firebase/database";
import * as $fst from "@firebase/storage";
import { limitToLast } from "@firebase/database";

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

/** Root Supplying **/
export const $firebase = initializeApp(firebaseConfig);
export const $firebase_auth = getAuth($firebase);
export const $firebase_database = $fdb.getDatabase($firebase);
export const $firebase_storage = $fst.getStorage($firebase);

export const $firebase_auth_cuid = $firebase_auth.currentUser?.uid;
export const $firebase_auth_cemail = $firebase_auth.currentUser?.email;
export const $firebase_auth_cname = $firebase_auth.currentUser?.displayName;
export const $firebase_auth_cphoto = $firebase_auth.currentUser?.photoURL;
export const $firebase_auth_user = $firebase_auth.currentUser;

/* export const $firebase_database_key = $fdb
  .push($fdb.ref($firebase_database))
  .key.substring(1);
  */

const $handling = (r, e) => {
 try {
  if (!r || typeof r !== "function")
   throw new Error("First parameter is missing!");
  else r();
 } catch (er) {
  if (!e || typeof e !== "function")
   throw new Error("Second parameter is missing!");
  else e(er.message);
 }
};

/****** Authentication ******/
/***/
/***/
/***/

export const $firebase_auth_check_admin = (result, error) => {
 $handling(
  async () => {
   $firebase_database_read(
    `settings/admins/`,
    (data) => {
     if (data) {
      let flag = false;
      data.map((d) => {
       if (d[0] === $firebase_auth.currentUser.email)
        result(true), (flag = true);
      });
      if (flag == false) result(false);
     }
    },
    (e) => {
     if (error) error(e);
    }
   );
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_auth_login_email = (email, password, result, error) => {
 $handling(
  async () => {
   await signInWithEmailAndPassword($firebase_auth, email, password)
    .then(() => {
     $firebase_auth_check_admin((r) => {
      if (r) {
       result($firebase_auth.currentUser);
      } else {
       error(
        "You are not an admin! Please contact with our administrators if you think it's a mistake."
       );
       deleteUser($firebase_auth.currentUser);
       $firebase_auth_logout(
        () => {},
        (e) => {
         if (error) error(e);
        }
       );
      }
     });
    })
    .catch((e) => {
     if (error) error(e.message);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_auth_login_google = (result, e) => {
 function checkAdmin() {
  $firebase_auth_check_admin((r) => {
   if (r) {
    result($firebase_auth.currentUser);
   } else {
    e(
     "You are not an admin! Please contact with our administrators if you think it's a mistake."
    );
    deleteUser($firebase_auth.currentUser);
    $firebase_auth_logout(
     () => {},
     (e) => {
      e(e);
     }
    );
   }
  });
 }
 $handling(
  async () => {
   const provider = new GoogleAuthProvider();
   provider.setCustomParameters({ prompt: "select_account" });
   const r = await signInWithPopup($firebase_auth, provider);
   checkAdmin();
  },
  (error) => {
   if (error) e(error);
  }
 );
};

export const $firebase_auth_logout = (result, error) => {
 $handling(
  async () => {
   const r = await signOut($firebase_auth);
   if (result) result(r);
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_auth_onAuth = (result, error) => {
 try {
  onAuthStateChanged($firebase_auth, (user) => {
   result(user);
  });
 } catch (e) {
  if (error) error(e);
 }
};

/****** Database ******/
/***/
/***/
/***/
// { getDatabase, ref, onValue, set, update }

export const $firebase_database_read = (path, result, error) => {
 $handling(
  () => {
   $fdb.onValue(
    $fdb.ref($firebase_database, path),
    (snapshot) => {
     result(snapshot.val() || null);
    },
    {
     onlyOnce: true,
    }
   );
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_database_write = (path, data, result, error) => {
 /* Note: (Overwrites) */
 $handling(
  () => {
   $fdb
    .set($fdb.ref($firebase_database, path), data)
    .then((s) => {
     result(true, s);
    })
    .catch((e) => {
     if (error) error(e);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_database_update = (path, data, result, error) => {
 /* Note: (Doesn't Overwrite) */
 $handling(
  () => {
   $fdb
    .update($fdb.ref($firebase_database, path), data, { merge: true })
    .then((s) => {
     result(true, s);
    })
    .catch((e) => {
     if (error) error(e);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_database_delete = (path, result, error) => {
 $handling(
  () => {
   $fdb
    .remove($fdb.ref($firebase_database, path))
    .then((s) => {
     result(true, s);
    })
    .catch((e) => {
     if (error) error(e);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

/****** Storage ******/
/***/
/***/
/***/
/* { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject } */

export const $firebase_storage_upload = (path /* Single */, data, then) => {
 let metadata = {};
 if (!data.file) data.file = data;
 else if (data.file && data.metadata) metadata = data.metadata;
 $handling(
  () => {
   then(
    $fst.uploadBytes($fst.ref($firebase_storage, path), data.file, metadata)
   );
  },
  (e) => {
   throw new Error(e);
  }
 );
};

export const $firebase_storage_download = (
 path /* Single */,
 result,
 error
) => {
 $handling(
  () => {
   $fst
    .getDownloadURL($fst.ref($firebase_storage, path))
    .then((s) => {
     result(s);
    })
    .catch((e) => {
     if (error) error(e);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_storage_downloads = (
 path /* Multiple */,
 result,
 error
) => {
 $handling(
  () => {
   $fst
    .listAll($fst.ref($firebase_storage, path))
    .then((s) => {
     result(s);
    })
    .catch((e) => {
     if (error) error(e);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export const $firebase_storage_delete = (path /* Single */, result, error) => {
 $handling(
  () => {
   $fst
    .deleteObject($fst.ref($firebase_storage, path))
    .then((s) => {
     result(s);
    })
    .catch((e) => {
     if (error) error(e);
    });
  },
  (e) => {
   if (error) error(e);
  }
 );
};

export default $firebase;
