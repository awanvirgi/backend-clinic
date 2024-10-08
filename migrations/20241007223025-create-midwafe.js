'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Midwaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      strId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['laki-laki', 'perempuan'], 
        allowNull: false
      },
      specialist: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Midwaves');
  }
};