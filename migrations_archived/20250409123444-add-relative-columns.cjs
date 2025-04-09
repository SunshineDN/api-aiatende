'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'marketing_tracking',
          'lead_id',
          {
            type: Sequelize.DataTypes.UUID,
            references: {
              model: 'leads', // Nome da tabela referenciada
              key: 'id', // Chave primária da tabela referenciada
            },
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'leads',
          'marketing_tracking_id',
          {
            type: Sequelize.DataTypes.UUID,
            references: {
              model: 'marketing_tracking', // Nome da tabela referenciada
              key: 'id', // Chave primária da tabela referenciada
            },
            allowNull: true,
          },
          { transaction: t },
        )
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
