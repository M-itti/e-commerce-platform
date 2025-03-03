const express = require('express');
const morgan = require('morgan');

const routes = require('./routes/v1');
const passport = require('./middlewares/authentication');

const app = express();

app.use(morgan('tiny'));
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', routes)

// TODO: should this be seperated?
// error handling for middleware
// User already exist should be logging output not error
app.use((err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'missing authorization credentials',
    });
  } else if (err && err.statusCode) {
      res.status(err.statusCode).json({
          status: 'error',
          message: err.message
      });
  } else if (err) {
    const message = typeof err.message === 'string' ? err.message : 'Internal Server Error';
    res.status(500).json({
        status: 'error',
        message
    });
  }
});

module.exports = app
