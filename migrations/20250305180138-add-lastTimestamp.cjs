'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'lead_threads',
          'assistant_messages',
          {
            type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.JSON)),
            after: "assistant_id"
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'lead_threads',
          'lastTimestamp',
          {
            type: Sequelize.DataTypes.DATE,
            after: "assistant_messages"
          },
          { transaction: t },
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
