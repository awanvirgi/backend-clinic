'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn(
                    'Appointments',
                    'visit',
                    {
                        type: Sequelize.DataTypes.ENUM,
                        values: ["online", "home", "klinik"],
                    },
                    { transaction: t },
                ),
                queryInterface.addColumn(
                    'Appointments',
                    'payment',
                    {
                        type: Sequelize.DataTypes.ENUM,
                        values: ["qris", "cash"],
                    },
                    { transaction: t },
                ),
                queryInterface.addColumn(
                    'Appointments',
                    'aname',
                    {
                        type: Sequelize.DataTypes.TEXT,
                    },
                    { transaction: t },
                ),
            ]);
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Appointments', 'visit', { transaction: t }),
                queryInterface.removeColumn('Appointments', 'payment', { transaction: t }),
                queryInterface.removeColumn('Appointments', 'aname', { transaction: t }),
            ]);
        });
    }
};
