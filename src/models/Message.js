import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'leads',
      key: 'lead_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  agent_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'assistant', 'system', 'tool', 'data'),
    allowNull: false,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  }
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: true,
});
 
Message.associate = models => {
  Message.belongsTo(models.Lead, {
    foreignKey: 'lead_id',
    as: 'leads',
  });
}

export default Message;