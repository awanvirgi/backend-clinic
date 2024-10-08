'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Patient.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['laki-laki', 'perempuan'], 
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    martialStatus: {
      type: DataTypes.ENUM,
      values: ['Sudah Menikah', 'Belum Menikah'], 
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};