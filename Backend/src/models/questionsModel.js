import { DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  examId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  questionText: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM('MCQ', 'TRUE_FALSE'),
    allowNull: false
  },

  marks: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Question;
