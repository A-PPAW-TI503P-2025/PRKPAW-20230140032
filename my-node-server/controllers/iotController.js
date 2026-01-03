// controllers/iotController.js
const { SensorLog } = require('../models'); // <-- PENTING: Import Model SensorLog

// 1. Fungsi Test Koneksi (Ping)
exports.testConnection = (req, res) => {
  const { message, deviceId } = req.body;
  console.log(`📡 [IOT] Pesan dari ${deviceId}: ${message}`);
  res.status(200).json({ status: "ok", reply: "Server menerima koneksi!" });
};

// 2. Fungsi Menerima Data Sensor (UPDATE BARU)
exports.receiveSensorData = async (req, res) => {
  try {
    // Tangkap data dari body request (dikirim oleh ESP32)
    const { suhu, kelembaban, cahaya } = req.body;

    // Validasi sederhana
    if (suhu === undefined || kelembaban === undefined) {
      return res.status(400).json({ 
        status: "error", 
        message: "Data suhu atau kelembaban tidak valid" 
      });
    }

    // Simpan ke Database
    const newData = await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0 // Default 0 jika LDR tidak kirim data
    });

    // Log agar terlihat di terminal
    console.log(`💾 [SAVED] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Cahaya: ${cahaya}`);

    // Beri respon sukses ke ESP32
    res.status(201).json({ status: "ok", message: "Data berhasil disimpan" });

  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. Fungsi Mengambil Riwayat Data untuk Frontend
exports.getSensorHistory = async (req, res) => {
  try {
    // Ambil 20 data terakhir, diurutkan dari yang paling baru
    const data = await SensorLog.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']]
    });

    // Kita balik urutannya (reverse) agar di grafik muncul dari Kiri (Lama) ke Kanan (Baru)
    const formattedData = data.reverse(); 

    res.json({
      status: "success",
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};