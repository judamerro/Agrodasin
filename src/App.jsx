import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import Servicios from "./pages/Servicios";
import Convocatorias from "./pages/Convocatorias";
import Noticias from "./pages/Noticias";
import Contacto from "./pages/Contacto";
import Diagnostico from "./pages/Diagnostico";
import LicitiA from "./pages/LicitiA";
import AgrodasinLicitia from "./pages/AgrodasinLicitia";
import LicitiaAnalisis from "./pages/LicitiaAnalisis";
import PruebaGratis from "./pages/PruebaGratis";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import ConvocatoriasDashboard from "./pages/ConvocatoriasDashboard";
import PlanesDashboard from "./pages/PlanesDashboard";
import DashboardFotos from "./pages/DashboardFotos";
import CrmDashboard from "./pages/CrmDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import NotFound from "./pages/NotFound";
import PageLoader from "./components/PageLoader";

const DASHBOARD_SESSION_KEY = "agrodasin-dashboard-unlocked";

const isDashboardSessionActive = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DASHBOARD_SESSION_KEY) === "true";
};

const ProtectedDashboardRoute = ({ children }) => {
  if (!isDashboardSessionActive()) {
    return <NotFound />;
  }

  return children;
};

function App() {
  return (
    <>
      {/* Premium initial growth loader */}
      <PageLoader />

      <Router>
        <Routes>
          <Route path="agrodasin/licitia" element={<AgrodasinLicitia />} />
          <Route path="agrodasin/licitia/analizar" element={<LicitiaAnalisis />} />
          <Route path="agrodasin/prueba-gratis" element={<PruebaGratis />} />

          {/* Main shell layouts */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="servicios" element={<Servicios />} />
            <Route path="convocatorias" element={<Convocatorias />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="blog" element={<Noticias />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="diagnostico" element={<Diagnostico />} />
            <Route path="licitia" element={<LicitiA />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="dashboard/usaurios"
              element={
                <ProtectedDashboardRoute>
                  <Usuarios />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="dashboard/convocatorias"
              element={
                <ProtectedDashboardRoute>
                  <ConvocatoriasDashboard />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="dashboard/planes"
              element={
                <ProtectedDashboardRoute>
                  <PlanesDashboard />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="dashboard/fotos"
              element={
                <ProtectedDashboardRoute>
                  <DashboardFotos />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="dashboard/crm"
              element={
                <ProtectedDashboardRoute>
                  <CrmDashboard />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="dashboard/analitica"
              element={
                <ProtectedDashboardRoute>
                  <AnalyticsDashboard />
                </ProtectedDashboardRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
