'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // define association here nanti
    }
  }

  Presensi.init({
    userId: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Presensi',
  });

  return Presensi;
};