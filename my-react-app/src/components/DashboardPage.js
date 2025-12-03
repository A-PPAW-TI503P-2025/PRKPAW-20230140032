import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({ name: "Pengguna", role: "N/A" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserData({
        name: decoded.nama || decoded.name || decoded.email || "Pengguna",
        role: decoded.role || "user",
      });
    } catch (error) {
      console.error("Token tidak valid:", error);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Memverifikasi sesi...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Selamat Datang</h1>
        <p className="text-2xl text-gray-800 mb-2">{userData.name}</p>
        <p className="text-sm text-gray-500 mb-8">Role: {userData.role}</p>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate("/attendance")} className="py-3 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Menu Presensi</button>
          <button onClick={handleLogout} className="py-3 px-6 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;