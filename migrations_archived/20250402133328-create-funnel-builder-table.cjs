'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('funnel_builder', {
      id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      professional: {
        type: Sequelize.DataTypes.JSON,
      },
      service: {
        type: Sequelize.DataTypes.JSON,
      },
      service_intro_page: {
        type: Sequelize.DataTypes.JSON,
      },
      testimony: {
        type: Sequelize.DataTypes.JSON,
      },
      register: {
        type: Sequelize.DataTypes.JSON,
      },
      period: {
        type: Sequelize.DataTypes.JSON,
      },
      shift: {
        type: Sequelize.DataTypes.JSON,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
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
