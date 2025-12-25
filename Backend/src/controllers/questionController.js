import { ERROR_MESSAGES } from "../common/errorMessages.js";
import { STATUS_CODES } from "../common/statusCode.js";
import { SUCCESS_MESSAGES } from "../common/successMessages.js";
import { Question, Option } from "../models/index.js";

export const addQuestion = async (req, res) => {
  try {
    const { examId, questionText, type, marks, options } = req.body;

    if (!examId || !questionText || !type || !marks || !options?.length) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ success:false, message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    const question = await Question.create({
      examId,
      questionText,
      type,
      marks
    });

    const optionData = options.map(opt => ({
      questionId: question.id,
      optionText: opt.optionText,
      isCorrect: opt.isCorrect
    }));

    await Option.bulkCreate(optionData);

    res.status(STATUS_CODES.OK).json({ success:true, message: SUCCESS_MESSAGES.QUESTION_ADDED, question });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success:false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

export const getQuestionsByExam = async (req, res) => {
  try {
    const examId = req.params.examId;

    const questions = await Question.findAll({
      where: { examId },
      include: [
        {
          model: Option,
          attributes: ["id", "optionText"]
        }
      ]
    });

    res.status(STATUS_CODES.OK).json({ success:true, questions });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success:false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE });
  }
};
