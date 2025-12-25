import jwt from 'jsonwebtoken'
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {

    const token = req.cookies.accessToken
    const user = jwt.decode(token)

    if(!user || !user.role){
        return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource'
      });
    }

    next();
  };
};

export default roleMiddleware;
