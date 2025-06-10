import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navigation from "./components/Nav/Navigation";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default App;
