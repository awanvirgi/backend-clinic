'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Appointment.belongsTo(models.Midwafe, {
                foreignKey: "doctorId"
            });
            Appointment.belongsTo(models.Patient, {
                foreignKey: 'patientId',
            })
        }
    }
    Appointment.init({
        patientId: DataTypes.BIGINT,
        doctorId: DataTypes.BIGINT,
        price: DataTypes.BIGINT,
        date: DataTypes.DATE,
        token: DataTypes.TEXT,
        services: DataTypes.TEXT,
        reason: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Appointment',
    });
    return Appointment;
};