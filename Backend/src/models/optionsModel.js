import { DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig.js';

const Option = sequelize.define('Option', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  optionText: {
    type: DataTypes.STRING,
    allowNull: false
  },

  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

export default Option;
