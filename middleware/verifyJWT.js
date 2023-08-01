require('dotenv').config();
const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {

  console.log(req.headers)
  console.log(req.headers.origin)
  // get the token from the header if present
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified.username;
    next();
  } catch (error) {
    res.status(403).send('Invalid token');
  }
};

module.exports = verifyJWT;