import { DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig.js';
import User from './userModel.js';
import Exam from './examModel.js';

const Result = sequelize.define('Result', {
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Exam,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalMarks: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Result;
