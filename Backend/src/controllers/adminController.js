import { ERROR_MESSAGES } from "../common/errorMessages.js"
import { STATUS_CODES } from "../common/statusCode.js"
import { SUCCESS_MESSAGES } from "../common/successMessages.js"
import { createAccessToken, createRefreshToken } from "../utils/jwtTokenGenerate.js"

export const adminLogin = (req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password){
            res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:ERROR_MESSAGES.MISSING_FIELDS})
            return
        }
        if(email == process.env.ADMIN_EMAIL){
            if(password == process.env.ADMIN_PASSWORD){
                const accessToken = createAccessToken("admin123",process.env.ADMIN_EMAIL,"admin")
                const refreshToken = createRefreshToken("admin123",process.env.ADMIN_EMAIL,"admin")
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
                res.status(STATUS_CODES.OK).json({success:true,message:SUCCESS_MESSAGES.ADMIN_LOGGEDIN})
            }else{
                res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:ERROR_MESSAGES.PASSWORD_WRONG})
            }
        }else{
            res.status(STATUS_CODES.NOT_FOUND).json({success:false,message:ERROR_MESSAGES.EMAIL_NOT_EXIST})
        }
    } catch (error) {
        console.log(error)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE})
    }
}

export const adminLogout = (req,res) => {
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
    res.status(STATUS_CODES.OK).json({success:true,message:SUCCESS_MESSAGES.ADMIN_LOGOUT})
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE})
    }
}