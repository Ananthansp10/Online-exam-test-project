import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized',isAuth:false });
  }

  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (!err) {
        return next();
      }

      // if (err.name !== 'TokenExpiredError') {
      //   return res.status(401).json({ success: false, message: 'Invalid token' });
      // }

      handleRefreshToken(req, res, next, refreshToken);
    });
  } else {
    handleRefreshToken(req, res, next, refreshToken);
  }
};

const handleRefreshToken = (req, res, next, refreshToken) => {
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Session expired',isExpired: true });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
    });
    next();
  });
};

export default authMiddleware;
