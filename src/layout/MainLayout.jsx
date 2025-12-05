import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className={`${isDesktop ? "ml-64" : ""}`}>
        <Header />
      </div>
      {isDesktop && <Sidebar />}
      <main className={isDesktop ? "ml-64" : "pb-16"}>{children}</main>
      {!isDesktop && <BottomNavbar />}
    </div>
  );
};

export default MainLayout;
