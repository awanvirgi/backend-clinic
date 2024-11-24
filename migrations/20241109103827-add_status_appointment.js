'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn(
                    'Appointments',
                    'status',
                    {
                        type: Sequelize.DataTypes.ENUM,
                        values: ["Belum", "Proses", "Selesai"],
                    },
                    { transaction: t },
                ),
            ]);
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Appointments', 'status', { transaction: t }),
            ]);
        });
    }
};
