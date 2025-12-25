import { ERROR_MESSAGES } from "../common/errorMessages.js";
import { STATUS_CODES } from "../common/statusCode.js";
import { SUCCESS_MESSAGES } from "../common/successMessages.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { createAccessToken, createRefreshToken } from "../utils/jwtTokenGenerate.js";

export const userSignup = async (req,res) =>{
    try {
        const {name,email,phoneNumber,password} = req.body
        if(!name || !email || !phoneNumber || !password){
            res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:ERROR_MESSAGES.MISSING_FIELDS})
            return
        }
        const isUserExist = await User.findOne({where:{email}})
        if(isUserExist){
            res.status(STATUS_CODES.CONFLICT).json({success:false,message:ERROR_MESSAGES.USER_EXIST})
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            await User.create({
                name:name,
                email:email,
                phoneNumber:phoneNumber,
                password:hashedPassword
            })
            res.status(STATUS_CODES.OK).json({success:true,message:SUCCESS_MESSAGES.USER_CREATED})
        }
    } catch (error) {
        console.log(error)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE})
    }
}

export const userSignin = async (req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password){
            res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:ERROR_MESSAGES.MISSING_FIELDS})
            return
        }
        const isUserExist = await User.findOne({where:{email}})
        if(!isUserExist){
            res.status(STATUS_CODES.NOT_FOUND).json({success:false,message:ERROR_MESSAGES.EMAIL_NOT_EXIST})
            return
        }else{
            const isPasswordMatch = await bcrypt.compare(password,isUserExist.password)
            if(!isPasswordMatch){
                res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:ERROR_MESSAGES.PASSWORD_WRONG})
                return
            }else{
                let accessToken = createAccessToken(isUserExist.id,isUserExist.email,"user")
                let refreshToken = createRefreshToken(isUserExist.id,isUserExist.email,"user")
                res.cookie("accessToken",accessToken,{
                    httpOnly:true,
                    secure:true,
                    sameSite:"none",
                    maxAge:parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
                })
                res.cookie("refreshToken",refreshToken,{
                    httpOnly:true,
                    secure:true,
                    sameSite:"none",
                    maxAge:parseInt(process.env.REFRESH_TOKEN_MAX_AGE)
                })
                res.status(STATUS_CODES.OK).json({success:true,message:SUCCESS_MESSAGES.USER_LOGGEEDIN,data:{userId:isUserExist.id,email:isUserExist.email}})
            }
        }
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE})
    }
}

export const userLogout = (req,res) => {
    try {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE)
    });
        res.status(STATUS_CODES.OK).json({success:true,message:SUCCESS_MESSAGES.USER_LOGOUT})
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE})
    }
}