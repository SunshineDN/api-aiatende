'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'lead_messages',
          'author_id',
          {
            type: Sequelize.DataTypes.UUID,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'lead_threads',
          'author_id',
          {
            type: Sequelize.DataTypes.UUID,
          },
          { transaction: t },
        ),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
