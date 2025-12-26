import { ADMIN_API_ROUTE } from "../apiRoutes/adminApiRoute"
import axios from "../config/axiosConfig"

interface ExamData{
    title:string;
    description:string;
    totalMarks:number;
    duration:number
}
interface ChoicePayload {
  text: string;
  isCorrect: boolean;
}
interface QuestionPayload {
  examId: number;
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE';
  marks: number;
  options: ChoicePayload[];
}


export const adminSignin = async (data:{email:string, password:string}) => {
    try {
        return await axios.post(ADMIN_API_ROUTE.ADMIN_SIGNIN,data)
    } catch (error) {
        throw error
    }
}

export const adminLogout = async () => {
    try {
       return await axios.post(ADMIN_API_ROUTE.ADMIN_LOGOUT)
    } catch (error) {
        throw error
    }
}

export const createExam = async (data:ExamData) => {
    try {
        return await axios.post(ADMIN_API_ROUTE.EXAM_CREATE,data)
    } catch (error) {
        throw error
    }
}

export const getAllExams = async () => {
    try {
        return await axios.get(ADMIN_API_ROUTE.GET_ALL_EXAMS)
    } catch (error) {
        throw error
    }
}

export const getExam = async (examId:number) => {
    try {
       return await axios.get(ADMIN_API_ROUTE.GET_EXAM(examId))
    } catch (error) {
        throw error
    }
}

export const addQuestions = async (data:QuestionPayload[]) => {
    try {
       return await axios.post(ADMIN_API_ROUTE.ADD_QUESTIONS,data)
    } catch (error) {
        throw error
    }
}