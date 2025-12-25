import Result from "../models/resultModel.js";
import Question from "../models/questionModel.js";
import Option from "../models/optionModel.js";

export const submitExam = async (req, res) => {
  try {
    const { examId, answers, startTime, duration } = req.body;

    const examEndTime = new Date(new Date(startTime).getTime() + duration * 60000);
    if (new Date() > examEndTime) {
      return res.status(400).json({ message: "Exam time expired" });
    }

    const existingResult = await Result.findOne({ where: { examId, userId: req.user.id } });
    if (existingResult) {
      return res.status(403).json({ message: "You have already attempted this exam" });
    }

    let totalScore = 0;
    let totalMarks = 0;

    for (let ans of answers) {
      const question = await Question.findByPk(ans.questionId, {
        include: [{ model: Option, attributes: ["id", "isCorrect"] }]
      });

      if (!question) continue;

      totalMarks += question.marks;

      const correctOption = question.Options.find(opt => opt.isCorrect);
      if (correctOption && correctOption.id === ans.selectedOptionId) {
        totalScore += question.marks;
      }
    }

    const result = await Result.create({
      examId,
      userId: req.user.id,
      score: totalScore,
      totalMarks
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      result: {
        score: totalScore,
        totalMarks,
        percentage: ((totalScore / totalMarks) * 100).toFixed(2)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
