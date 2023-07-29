const express = require('express');
const jwt = require('jsonwebtoken');

const userData = require('./data/dummy.js');
const app = express();

app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // console.log('username: ', username);
  // console.log('password: ', password);

  const user = userData.find((user) => (user.username === username && user.password === password));

  if (user) {
    // generate token
    const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'mysecretkey');

    res.json({
      success: true,
      message: 'Login success',
      data: {
        username: user.username,
        isAdmin: user.isAdmin,
        accessToken: accessToken
      }
    });

  } else {
    res.json({
      success: false,
      message: 'Login failed'
    });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'mysecretkey', (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    });  
      
  } else {
    res.status(401).json("You are not authenticated");
  }
}

app.delete('/api/users/:userId', verifyToken, (req, res) => {
  console.log(req.user)
  console.log(parseFloat(req.params.userId))
  if (req.user.id === parseFloat(req.params.userId) || req.user.isAdmin) {
    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'You are not allowed to delete this user',
    });
  }

});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});