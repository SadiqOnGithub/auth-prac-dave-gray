const express = require('express');
// const bodyParser = require('body-parser');
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => {
  console.log(__dirname)
  res.send('Hello World!');
});

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})