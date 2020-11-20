const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header('jwt_token');
    if (!jwtToken) {
      return res.status(403).json('Not authorized');
    }
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    req.user = payload.user;
    next();
  } catch (err) {
    console.log(err.message);
    if (err.message === 'jwt expired') {
      return res.status(403).json('JWT expired');
    }
  }
};
