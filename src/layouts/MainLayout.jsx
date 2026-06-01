import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export const MainLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top of the screen on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" // We use instant so there's no visible jump during transition
    });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      {/* Fixed Header */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Floating Interactive Widget */}
      <FloatingWhatsApp />

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
};
export default MainLayout;
