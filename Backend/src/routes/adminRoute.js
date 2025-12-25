import express from 'express'
import { adminLogin, adminLogout } from '../controllers/adminController.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/roleVerify.js'
const router = express.Router()

router.post('/signin',adminLogin)

router.post('/logout',verifyToken,verifyRole("admin"),adminLogout)

export default router