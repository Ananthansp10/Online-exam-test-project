import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.JWT_ACCESS_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE

export const createAccessToken = (userId,email,role) => {
    return jwt.sign({id:userId,email:email,role:role},accessTokenSecret,{expiresIn:accessTokenExpire})
}

export const createRefreshToken = (userId,email,role) => {
    return jwt.sign({id:userId,email:email,role:role},refreshTokenSecret,{expiresIn:refreshTokenExpire})
}

