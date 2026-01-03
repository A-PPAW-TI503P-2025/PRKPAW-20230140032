import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState(null);

  // --- STATE KAMERA ---
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // --- PERBAIKAN LOKASI DISINI ---
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini.");
      setLoadingLocation(false);
      return;
    }

    // Opsi agar tidak timeout (HighAccuracy dimatikan dulu biar lancar di laptop)
    const geoOptions = {
      enableHighAccuracy: false, 
      timeout: 30000, 
      maximumAge: 0 
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
        setLoadingLocation(false);
      },
      (err) => {
        console.warn("Error Geolocation:", err);
        setError("Gagal mendapatkan lokasi: " + err.message);
        setLoadingLocation(false);
      },
      geoOptions
    );
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    };
  };

  const handleCheckIn = async () => {
    setMessage(null);
    setError(null);

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }
    if (!image) {
      setError("Wajib mengambil foto selfie sebelum Check-In!");
      return;
    }

    setLoadingAction(true);
    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        getAuthConfig()
      );

      setMessage({
        type: "success",
        text: response.data?.message || "Check-in berhasil",
      });
      // setImage(null); // Uncomment jika ingin reset foto otomatis
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Gagal melakukan check-in.";
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Presensi Lokasi
        </h1>

        {/* PETA */}
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
                  attribution='&copy; OpenStreetMap contributors'
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

        {/* CARD KONTROL & KAMERA */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Ambil Selfie</h2>

            {/* AREA KAMERA */}
            <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-black relative">
              {image ? (
                <img src={image} alt="Selfie" className="w-full h-64 object-cover" />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-64 object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
              )}
            </div>

            {/* TOMBOL KAMERA */}
            <div className="mb-6">
              {!image ? (
                <button
                  onClick={capture}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full w-full font-medium transition"
                >
                  📸 Ambil Foto
                </button>
              ) : (
                <button
                  onClick={() => setImage(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full w-full font-medium transition"
                >
                  🔄 Foto Ulang
                </button>
              )}
            </div>

            {/* PESAN STATUS */}
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

            {/* DATA KOORDINAT */}
            <div className="text-sm text-gray-600 mb-4">
              <p>Latitude: <span className="font-medium">{coords?.lat ?? "-"}</span></p>
              <p>Longitude: <span className="font-medium">{coords?.lng ?? "-"}</span></p>
            </div>

            {/* TOMBOL ACTION */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCheckIn}
                disabled={loadingAction || !image}
                className={`px-5 py-2.5 rounded-lg shadow-sm text-white font-medium flex-1 ${
                  !image 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loadingAction ? "Memproses..." : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={loadingAction}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex-1 font-medium"
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