import { ERROR_MESSAGES } from "../common/errorMessages.js";
import { STATUS_CODES } from "../common/statusCode.js";
import { SUCCESS_MESSAGES } from "../common/successMessages.js";
import { Question, Option } from "../models/index.js";

export const addQuestion = async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload"
      });
    }

    for (const q of questions) {
      const { examId, questionText, type, marks, options } = q;

      if (!examId || !questionText || !type || !marks || !options?.length) {
        return res.status(400).json({
          success: false,
          message: "Missing fields"
        });
      }

      const question = await Question.create({
        examId,
        questionText,
        type,
        marks
      });

      const optionData = options.map(c => ({
        questionId: question.id,
        optionText: c.text,
        isCorrect: c.isCorrect
      }));

      await Option.bulkCreate(optionData);
    }

    res.status(201).json({
      success: true,
      message: "Questions added successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
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
    console.log(questions)
    res.status(STATUS_CODES.OK).json({ success:true, questions });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success:false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE });
  }
};
