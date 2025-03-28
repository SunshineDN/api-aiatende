'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('UTM Parameters', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      utm_source: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      utm_medium: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      utm_campaign: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      utm_term: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      utm_content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lead_id: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'Leads', // Nome da tabela referenciada
          },
          key: 'id', // Chave primária da tabela referenciada
        },
        allowNull: false,
      }
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
