'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'leads',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      agent_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('user', 'assistant', 'system', 'tool', 'data'),
        allowNull: false,
      },
      content: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
