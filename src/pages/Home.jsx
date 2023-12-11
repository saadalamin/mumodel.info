import React from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

function Home({ branches, auth }) {
 return (
  <>
   <Navbar auth={auth} />
   {auth && <Dashboard branches={branches} />}
  </>
 );
}

export default Home;
