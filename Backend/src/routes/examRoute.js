import express from 'express'
const router = express.Router()
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/roleVerify.js'
import { createExam, getAllExams, getExamById } from '../controllers/examController.js'

router.post("/create-exam",verifyToken,verifyRole("admin"),createExam)

router.get("/get-exams",verifyToken,verifyRole("admin"),getAllExams)

router.get("/get-exam/:id",verifyToken,verifyRole("admin"),getExamById)

export default router