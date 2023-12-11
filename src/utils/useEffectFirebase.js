import React from "react";
import { $firebase_auth_onAuth } from "./firebase";

export default function (arr, fn, unm) {
 React.useEffect(() => {
  $firebase_auth_onAuth((user) => {
   if (user) {
    fn(user);
   }
  });
  return () => {
   if (unm) unm();
  };
 }, arr || []);
}
