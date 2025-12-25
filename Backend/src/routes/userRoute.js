import express from 'express'
import { userLogout, userSignin, userSignup } from '../controllers/userController.js'
import verifyToken from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/signup',userSignup)

router.post('/signin',userSignin)

router.post('/logout',verifyToken,userLogout)

export default router