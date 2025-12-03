import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = "http://localhost:3001/api/reports/daily";
      const url = query ? `${baseUrl}?nama=${encodeURIComponent(query)}` : baseUrl;
      const response = await axios.get(url, config);
      setReports(response.data.data || []);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(err.response?.data?.message || "Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchReports("");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi Harian</h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input type="text" placeholder="Cari berdasarkan nama..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow px-3 py-2 border rounded-md" />
        <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md">Cari</button>
      </form>

      {error && <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length > 0 ? (
              reports.map((presensi) => (
                <tr key={presensi.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{presensi.user ? presensi.user.nama : "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presensi.checkIn ? new Date(presensi.checkIn).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presensi.checkOut ? new Date(presensi.checkOut).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : "Belum Check-Out"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presensi.latitude || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presensi.longitude || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada data yang ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;