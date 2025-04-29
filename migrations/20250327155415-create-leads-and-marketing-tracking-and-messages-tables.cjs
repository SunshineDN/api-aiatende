'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('marketing_tracking', {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,
          },
          hash: {
            type: Sequelize.DataTypes.STRING(8),
            allowNull: true,
          },

          gclientid: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          gclid: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          fbclid: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          ga_utm: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          fbp: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          fbc: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },

          utm_content: {
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
          utm_source: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_term: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          utm_referrer: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          referrer: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
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
        }, {
          transaction: t,
        }),
        queryInterface.createTable('leads', {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            allowNull: false,
            primaryKey: true,
          },
          lead_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            unique: true,
          },
          data: {
            type: Sequelize.DataTypes.JSON,
            allowNull: true,
          },
          details: {
            type: Sequelize.DataTypes.JSON,
            allowNull: true,
          },
          marketing_tracking_id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: true,
            references: {
              model: 'marketing_tracking',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
        }, {
          transaction: t,
        }),
        queryInterface.createTable('messages', {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          lead_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
              model: 'leads',
              key: 'lead_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          agent_name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
          role: {
            type: Sequelize.DataTypes.ENUM('user', 'assistant', 'system', 'tool', 'data'),
            allowNull: false,
          },
          content: {
            type: Sequelize.DataTypes.JSON,
            allowNull: false,
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
        }, {
          transaction: t,
        })
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
