'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Presensi', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    });

    await queryInterface.addColumn('Presensi', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Presensi', 'latitude');
    await queryInterface.removeColumn('Presensi', 'longitude');
  }
};