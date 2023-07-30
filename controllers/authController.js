const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (users) {
    this.users = users;
  }
};

const fsProises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');


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
      res.status(200).json({
        success: `Welcome ${userFound.username.toUpperCase()}! You are now logged in.`
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