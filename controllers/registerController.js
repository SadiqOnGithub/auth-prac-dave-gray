const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (users) {
    this.users = users;
  }
};

const fsProises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');


const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!(username && password)) return res.status(400).send('Username and password are required');

  // Check if user already exists
  if (usersDB.users.find(user => user.username === username)) {
    // If user exists, return error
    return res.status(409).send('User already exists');
  }
  try {
    // If user doesn't exist, create new user
    const hashedPassword = await bcrypt.hash(password, 14);
    const newUser = { username, password: hashedPassword };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsProises.writeFile(path.join(__dirname, '../model/users.json'), JSON.stringify(usersDB.users));
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};


module.exports = {
  handleNewUser,
};
