import express from 'express'
import { userLogout, userSignin, userSignup } from '../controllers/userController.js'
import verifyToken from '../middleware/verifyToken.js'
import jwt from 'jsonwebtoken'
import { STATUS_CODES } from '../common/statusCode.js'
const router = express.Router()

router.post('/signup',userSignup)

router.post('/signin',userSignin)

router.post('/logout',verifyToken,userLogout)

router.post('/verify', verifyToken, (req, res) => {
  try {
    const allowedRoles = req.body.allowedRoles;
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, isAuth: false, message: 'No token' });
    }
    const decoded = jwt.decode(token)
    if (!decoded) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, isAuth: false, message: 'Invalid token' });
    }

    if (allowedRoles.includes(decoded.role)) {
      return res.status(STATUS_CODES.OK).json({ success: true, isAuth: true, role: decoded.role, userId: decoded.id });
    } else {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, isAuth: false, message: 'Role not allowed' });
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, isAuth: false, isExpired: true, message: 'Token expired' });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, isAuth: false, message: 'Something went wrong' });
  }
});

export default router