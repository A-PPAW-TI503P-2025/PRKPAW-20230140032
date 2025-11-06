const { Presensi } = require('../models');
const { Op } = require('sequelize');

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query; // ✅ ambil semua query
    const options = { where: {} };

    // Filter berdasarkan nama
    if (nama) {
      options.where.nama = { [Op.like]: '%${nama}%' };
    }

    // Filter berdasarkan tanggal checkIn
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    } else if (tanggalMulai) {
      options.where.checkIn = { [Op.gte]: new Date(tanggalMulai) };
    } else if (tanggalSelesai) {
      options.where.checkIn = { [Op.lte]: new Date(tanggalSelesai) };
    }

    // Tambahkan urutan data (misal urut dari terbaru)
    options.order = [['checkIn', 'DESC']];

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString('id-ID'),
      filter: { nama, tanggalMulai, tanggalSelesai },
      totalData: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil laporan',
      error: error.message,
    });
  }
};