"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Midwafe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Midwafe.init(
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      strId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["laki-laki", "perempuan"],
        allowNull: false,
      },
      specialist: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Midwafe",
    }
  );
  return Midwafe;
};
