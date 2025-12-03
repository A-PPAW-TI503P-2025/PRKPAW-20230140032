import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";
import Navbar from "./components/Navbar";
import "leaflet/dist/leaflet.css";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/attendance" element={<MainLayout><PresensiPage /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><ReportPage /></MainLayout>} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
export default App;