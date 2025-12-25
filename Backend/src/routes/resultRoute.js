import express from 'express'
import { startExam } from '../controllers/examController'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/roleVerify.js'
import { submitExam } from '../controllers/resultController.js'
const router = express.Router()

router.get('/start-exam/:examId',verifyToken,verifyRole("user"),startExam)

router.post('/submit-exam',verifyToken,verifyRole("user"),submitExam)

export default router