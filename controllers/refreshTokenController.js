const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (users) {
    this.users = users;
  }
};

require('dotenv').config();
const jwt = require('jsonwebtoken');

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(401).json({ "error": "Invalid cookies" });

  const refreshToken = cookies.refreshToken;

  const userFound = usersDB.users.find(user => user.refreshToken === refreshToken);

  if (!userFound) return res.status(403).send('User not found');

  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (userFound.username !== verified.username) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { "username": verified.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    res.json({ accessToken });

  } catch (error) {
    console.log(error)
    res.status(403).send(error.message);
  }
};


module.exports = {
  handleRefreshToken, 
}