import Exam from './examModel.js';
import Question from './questionsModel.js';
import Option from './optionsModel.js';

Exam.hasMany(Question, {
  foreignKey: 'examId',
  onDelete: 'CASCADE'
});

Question.belongsTo(Exam, {
  foreignKey: 'examId'
});

Question.hasMany(Option, {
  foreignKey: 'questionId',
  onDelete: 'CASCADE'
});

Option.belongsTo(Question, {
  foreignKey: 'questionId'
});

export {
  Exam,
  Question,
  Option
};
