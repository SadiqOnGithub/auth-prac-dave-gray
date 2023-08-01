const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (users) {
    this.users = users;
  }
};

const fsProises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  // On Client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // no content

  const refreshToken = cookies.refreshToken;

  // is refresh token in db?
  const userFound = usersDB.users.find(user => user.refreshToken === refreshToken);

  // If the user not found then clear cookies
  if (!userFound) {
    res.clearCookie('refreshToken', { httpOnly: true });
    return res.sendStatus(204); // successful but no content
  };

  // if user found
  try {
    // Delete the refresh token from db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== userFound.refreshToken);
    const currentUserUpdated = { ...userFound, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUserUpdated]);

    await fsProises.writeFile(
      path.join(__dirname, '../model/users.json'),
      JSON.stringify(usersDB.users)
    );

    res.clearCookie('refreshToken', { httpOnly: true }); // secure: true => only serves on https
    res.sendStatus(204); // successful but no content

  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports = {
  handleLogout,
};