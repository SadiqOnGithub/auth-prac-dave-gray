const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (users) {
    this.users = users;
  }
};

require('dotenv').config();
const bcrypt = require('bcrypt');
const fsProises = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!(username && password)) return res.status(400).send('Username and password are required');

  const userFound = usersDB.users.find(user => user.username === username);

  if (!userFound) return res.status(404).send('User not found');

  try {
    const isPasswordCorrect = await bcrypt.compare(password, userFound.password);

    if (isPasswordCorrect) {

      // create JWTs
      const accessToken = jwt.sign({ username: userFound.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3000s' });
      const refreshToken = jwt.sign({ username: userFound.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '12h' });

      // save refresh token in DB
      const otherUsers = usersDB.users.filter(user => user.username !== username);
      const currentUserUpdated = { ...userFound, refreshToken };
      usersDB.setUsers([...otherUsers, currentUserUpdated]);
      await fsProises.writeFile(
        path.join(__dirname, '../model/users.json'),
        JSON.stringify(usersDB.users)
      );

      // send refresh token as cookie
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000 });
      // send access token as response
      res.status(200).json({
        accessToken,
      });
    } else {
      return res.status(401).send('password is incorrect');
    }

  } catch (error) {
    res.status(500).send('Internal server error');
  }
};


module.exports = {
  handleLogin,
};