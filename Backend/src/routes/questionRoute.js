import express from 'express'
const router = express.Router()
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/roleVerify.js'
import { addQuestion, getQuestionsByExam } from '../controllers/questionController.js'

router.post('/add-question',verifyToken,verifyRole("admin"),addQuestion)

router.get('/get-question/:examId',verifyToken,verifyRole("user"),getQuestionsByExam)

export default router