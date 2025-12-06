import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  
  // STATE UNTUK MODAL POPUP
  const [selectedImage, setSelectedImage] = useState(null); 
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchReports = async (query) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = "http://localhost:3001/api/reports/daily";
      const url = query
        ? `${baseUrl}?nama=${encodeURIComponent(query)}`
        : baseUrl;
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

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/presensi/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchReports(searchTerm);
    } catch (err) {
      alert("Gagal menghapus data: " + (err.response?.data?.message || err.message));
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const normalizedPath = path.replace(/\\/g, "/");
    return `http://localhost:3001/${normalizedPath}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-Out
              </th>
              {/* KOLOM BUKTI FOTO */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bukti Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi (Lat, Long)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length > 0 ? (
              reports.map((presensi) => (
                <tr key={presensi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {presensi.user ? presensi.user.nama : "N/A"}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presensi.checkIn
                      ? new Date(presensi.checkIn).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })
                      : "-"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presensi.checkOut
                      ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })
                      : <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">Belum Check-Out</span>}
                  </td>

                  {/* THUMBNAIL FOTO (KLIK UNTUK ZOOM) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {presensi.buktiFoto ? (
                      <div className="relative group w-12 h-12">
                        <img
                          src={getImageUrl(presensi.buktiFoto)}
                          alt="Bukti"
                          // Saya tambahkan 'cursor-zoom-in' biar kelihatan bisa diklik
                          className="w-full h-full object-cover rounded border cursor-zoom-in hover:scale-110 transition-transform shadow-sm"
                          onClick={() => setSelectedImage(getImageUrl(presensi.buktiFoto))}
                        />
                        {/* Overlay efek hover */}
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded cursor-zoom-in"
                          onClick={() => setSelectedImage(getImageUrl(presensi.buktiFoto))}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No Photo</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    <div>Lat: {presensi.latitude || "-"}</div>
                    <div>Lng: {presensi.longitude || "-"}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(presensi.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full text-xs font-semibold transition"
                    >
                      Hapus 🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL / POPUP FULLSCREEN --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 transition-opacity backdrop-blur-sm"
          onClick={() => setSelectedImage(null)} // Klik background hitam untuk tutup
        >
          <div className="relative max-w-5xl max-h-screen">
            {/* Tombol Tutup (X) */}
            <button
              className="absolute -top-12 right-0 text-white text-3xl font-bold hover:text-gray-300 transition"
              onClick={() => setSelectedImage(null)}
            >
              &times; Tutup
            </button>
            
            {/* Gambar Besar */}
            <img 
              src={selectedImage} 
              alt="Bukti Full" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-2 border-gray-700"
              onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak menutup modal
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;