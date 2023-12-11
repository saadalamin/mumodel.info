import React from "react";
import Navbar from "../components/Navbar";

export default function Academics({ branches, auth }) {
 return (
  <>
   <Navbar auth={auth} />
   {auth && (
    <div className="Notices">
     <p>Academics</p>
    </div>
   )}
  </>
 );
}
