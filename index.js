const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');

const app = express();
const PORT = process.env.PORT || 3000;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
// We can set credentials option true to allow cross-origin? Can we? or shall we make a pull request?
app.use(cors(corsOptions));

// handle json data
app.use(express.json());

// handle cookies data
app.use(cookieParser());

// routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT)
app.get('/', require('./routes/root'));

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));