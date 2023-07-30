const express = require('express');
const app = express();
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

// custom middleware logger
app.use(logger);

// handle json data
app.use(express.json());

// routes
app.get('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

// error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})