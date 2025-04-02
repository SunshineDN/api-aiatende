'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('leads', {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          data: {
            type: Sequelize.DataTypes.JSON,
            allowNull: true,
          },
          details: {
            type: Sequelize.DataTypes.JSON,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        }, {
          transaction: t,
        }),
        queryInterface.createTable('marketing_tracking', {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          gclid: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_source: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_medium: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_campaign: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_term: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_content: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_referrer: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          lead_id: {
            type: Sequelize.DataTypes.UUID,
            references: {
              model: 'leads', // Nome da tabela referenciada
              key: 'id', // Chave primária da tabela referenciada
            },
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        }, {
          transaction: t,
        }),
      ])
    })
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
