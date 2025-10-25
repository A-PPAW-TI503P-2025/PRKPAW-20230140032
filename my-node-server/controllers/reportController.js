// <--- 1. IMPOR MODEL ANDA
// Pastikan Anda mengimpor model dari database
// Sesuaikan nama 'Presensi' jika nama file model Anda berbeda
const { Presensi } = require('../models');

// <--- 2. UBAH MENJADI FUNGSI 'async'
// Kita butuh 'async' agar bisa menggunakan 'await' untuk operasi database
exports.getDailyReport = async (req, res) => {
  
  // <--- 3. GUNAKAN BLOK 'try...catch'
  // Ini SANGAT PENTING untuk menangani error jika database gagal
  try {
    
    console.log("Controller: Mengambil data laporan harian dari DATABASE...");
    
    // <--- 4. DEFINISIKAN 'presensiRecords'
    // Ini adalah baris yang hilang.
    // Kita mengambil SEMUA data dari tabel 'Presensi'
    const presensiRecords = await Presensi.findAll();

    // Jika berhasil, kirim data sebagai JSON
    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: presensiRecords, // Variabel ini sekarang sudah terdefinisi
    });

  } catch (error) {
    
    // <--- 5. TANGANI ERROR
    // Jika ada masalah (koneksi database putus, tabel tidak ada, dll.)
    console.error("Error saat mengambil laporan harian:", error);
    res.status(500).json({
      message: "Gagal mengambil data dari server.",
      error: error.message
    });
  }
};