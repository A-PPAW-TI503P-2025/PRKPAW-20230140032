import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// NOTE: jika marker default tidak muncul karena masalah icon di build, kita bisa
// menambahkan override icon di file index.js. Aku tidak paksa di sini supaya tetap sederhana.

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // ambil lokasi saat komponen mount
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
        setLoadingLocation(false);
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  const handleCheckIn = async () => {
    setMessage(null);
    setError(null);
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    setLoadingAction(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        getAuthConfig()
      );

      setMessage({
        type: "success",
        text: response.data?.message || "Check-in berhasil",
      });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal melakukan check-in.";
      setError(msg);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCheckOut = async () => {
    setMessage(null);
    setError(null);
    setLoadingAction(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        getAuthConfig()
      );

      setMessage({
        type: "success",
        text: response.data?.message || "Check-out berhasil",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal melakukan check-out.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Presensi Lokasi</h1>

        {/* Peta Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div style={{ height: 320, width: "100%" }}>
            {coords ? (
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Lokasi Presensi Anda</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {loadingLocation ? "Mencari lokasi..." : "Lokasi tidak tersedia"}
              </div>
            )}
          </div>
        </div>

        {/* Card Kontrol */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Lakukan Presensi</h2>

            {/* status message */}
            {message && (
              <div
                className={`mb-3 text-sm px-3 py-2 rounded ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {error && (
              <div className="mb-3 text-sm px-3 py-2 rounded bg-red-50 text-red-700">
                {error}
              </div>
            )}

            <div className="text-sm text-gray-600 mb-4">
              <p>Latitude: <span className="font-medium">{coords?.lat ?? "-"}</span></p>
              <p>Longitude: <span className="font-medium">{coords?.lng ?? "-"}</span></p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCheckIn}
                disabled={loadingAction}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm disabled:opacity-60"
              >
                {loadingAction ? "Memproses..." : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={loadingAction}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm disabled:opacity-60"
              >
                {loadingAction ? "Memproses..." : "Check Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;