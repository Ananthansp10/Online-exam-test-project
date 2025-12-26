import { USER_API_ROUTE } from "../apiRoutes/userApiRoute";
import axios from "../config/axiosConfig";

interface UserData{
    name:string;
    email:string;
    phoneNumber:string;
    password:string;
}

export const userSignup = async (data:UserData) => {
    try {
        return await axios.post(USER_API_ROUTE.USER_SIGNUP,data)
    } catch (error) {
        throw error
    }
}

export const userSignin = async (data:{email:string, password:string}) => {
    try {
        return await axios.post(USER_API_ROUTE.USER_SIGNIN,data)
    } catch (error) {
        throw error
    }
}

export const userLogout = async () => {
    try {
        return await axios.post(USER_API_ROUTE.USER_LOGOUT)
    } catch (error) {
        throw error
    }
}

export const getQuestions = async (examId:number) => {
    try {
        return await axios.get(USER_API_ROUTE.GET_QUESTIONS(examId))
    } catch (error) {
        throw error
    }
}