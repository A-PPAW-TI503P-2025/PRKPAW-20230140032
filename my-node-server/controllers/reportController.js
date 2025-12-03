const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

const { format } = require("date-fns-tz");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    let options = {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama"],
        },
      ],
    };

    if (nama) {
      // Baris ini akan error jika 'Op' tidak diimpor
      options.include[0].where = {
        nama: {
          [Op.like]: `%${nama}%`,
        },
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};