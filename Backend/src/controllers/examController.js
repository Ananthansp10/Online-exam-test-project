import { ERROR_MESSAGES } from "../common/errorMessages.js";
import { STATUS_CODES } from "../common/statusCode.js";
import { SUCCESS_MESSAGES } from "../common/successMessages.js";
import { Exam, Question } from "../models/index.js";
import Result from "../models/resultModel.js";

export const createExam = async (req, res) => {
  try {
    const { title, description, duration, totalMarks } = req.body;

    if (!title || !duration || !totalMarks) {
      return res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    const exam = await Exam.create({
      title,
      description,
      duration,
      totalMarks
    });

    res.status(STATUS_CODES.OK).json({ success: true, message: SUCCESS_MESSAGES.EXAM_CREATED, exam });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success:false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({attributes: [
      'id',
      'title',
      'description',
      'duration',
      'totalMarks',
      'isActive'
    ],
      raw: true}
    );
    res.status(STATUS_CODES.OK).json({ success: true, exams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:true, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

export const getExamById = async (req, res) => {
  try {
    const examId = req.params.id;

    const exam = await Exam.findOne({
      where: { id: examId },attributes: ['id', 'title', 'description', 'duration', 'totalMarks'],raw:true
    });

    if (!exam) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ success:true, message: ERROR_MESSAGES.EXAM_NOT_FOUND });
    }

    res.status(STATUS_CODES.OK).json({ success:true, data:exam });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success:true, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE });
  }
}

export const startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { userId } = req.params
    const exam = await Exam.findByPk(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const existingResult = await Result.findOne({ where: { examId, userId: userId } });
    if (existingResult) {
      return res.status(403).json({ message: "You have already attempted this exam" });
    }

    const startTime = new Date();

    res.status(200).json({
      examId: exam.id,
      title: exam.title,
      duration: exam.duration,
      startTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
