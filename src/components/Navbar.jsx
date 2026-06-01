import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, PhoneCall, Bot, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "../hooks/useScrollPosition";

export const Navbar = ({ variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const location = useLocation();

  const isScrolled = scrollPosition > 50;
  const isDashboardSessionActive =
    typeof window !== "undefined" && window.localStorage.getItem("agrodasin-dashboard-unlocked") === "true";
  const isDashboardRoute =
    variant === "dashboard" ||
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/dashboard/");

  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Servicios", path: "/servicios" },
    { name: "Convocatorias", path: "/convocatorias" },
    { name: "🤖 LicitiA", path: "/licitia" },
    { name: "Noticias", path: "/noticias" },
    { name: "🎯 Diagnóstico", path: "/diagnostico" },
    { name: "Contacto", path: "/contacto" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("agrodasin-dashboard-unlocked");
      window.localStorage.removeItem("agrodasin-dashboard-form-data");
    }
    window.location.href = "/";
  };

  const headerClasses = isDashboardRoute
    ? "bg-white/95 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
    : isScrolled
      ? "glass-nav py-3 shadow-md"
      : "bg-transparent py-5";

  const logoTextClasses = isDashboardRoute
    ? "text-slate-900"
    : isScrolled
      ? "text-gray-900"
      : "text-white";

  const desktopLinkBaseClasses = isDashboardRoute
    ? "text-slate-700 hover:text-emerald-700"
    : "";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${headerClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-green-700 to-green-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Leaf size={22} className="fill-white/10" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${logoTextClasses}`}>
              AGRO<span className={isDashboardRoute ? "text-emerald-600" : "text-secondary-500"}>DASIN</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const isLicitiA = item.path === "/licitia";

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center gap-2 text-sm font-medium tracking-wide relative py-1 transition-colors duration-300 ${
                    isLicitiA
                      ? isActive
                        ? isDashboardRoute
                          ? "text-amber-600 font-semibold"
                          : "text-yellow-300 font-semibold"
                        : isDashboardRoute
                          ? "text-amber-500 hover:text-amber-600"
                          : "text-yellow-400 hover:text-yellow-300"
                      : isActive
                      ? isDashboardRoute
                        ? "text-emerald-700 font-semibold"
                        : isScrolled
                          ? "text-green-600 font-semibold"
                          : "text-secondary-500 font-bold"
                      : isDashboardRoute
                        ? `${desktopLinkBaseClasses} hover:text-emerald-700`
                        : isScrolled
                          ? "text-gray-600 hover:text-secondary-500"
                          : "text-white/90 hover:text-white"
                  }`}
                >
                  {Icon ? <Icon size={16} className="shrink-0" /> : null}
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isLicitiA
                          ? "bg-amber-500"
                          : isDashboardRoute
                            ? "bg-emerald-600"
                            : isScrolled
                              ? "bg-green-600"
                              : "bg-green-400"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={isDashboardSessionActive ? "/dashboard" : "/contacto"}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                isDashboardRoute
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : isScrolled
                    ? "bg-green-700 hover:bg-green-600 text-white hover:shadow-green-700/20"
                    : "bg-white hover:bg-green-50 text-green-800 hover:shadow-white/20"
              }`}
            >
              {isDashboardSessionActive ? <LayoutDashboard size={16} /> : <PhoneCall size={16} />}
              {isDashboardSessionActive ? "Dashboard" : "Asesoría Gratis"}
            </Link>
            {isDashboardSessionActive && (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className={`inline-flex items-center justify-center rounded-full p-2.5 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                  isScrolled
                    ? "bg-red-600/90 hover:bg-red-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${
                isDashboardRoute
                  ? "text-slate-900 hover:bg-slate-100"
                  : isScrolled
                    ? "text-gray-800 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
              }`}
              aria-label="Alternar menú"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const isLicitiA = item.path === "/licitia";

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-colors ${
                      isLicitiA
                        ? isActive
                          ? "bg-amber-50 text-amber-700"
                          : "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                        : isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                    }`}
                  >
                    {Icon ? <Icon size={18} className="shrink-0" /> : null}
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-4 space-y-3">
                <Link
                  to={isDashboardSessionActive ? "/dashboard" : "/contacto"}
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  {isDashboardSessionActive ? <LayoutDashboard size={18} /> : <PhoneCall size={18} />}
                  {isDashboardSessionActive ? "Dashboard" : "Asesoría Gratis"}
                </Link>
                {isDashboardSessionActive && (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    aria-label="Cerrar sesión"
                    className="flex items-center justify-center w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
