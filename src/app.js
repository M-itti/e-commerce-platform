const express = require('express');
const morgan = require('morgan');

const routes = require('./routes/v1');
const passport = require('./middlewares/authentication');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { swaggerUi, swaggerDocs } = require("./middlewares/swagger");

const app = express();

app.use(morgan('tiny'));
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiter);
app.use('/api/v1', routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((err, req, res) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'missing authorization credentials',
    });

  } else if (err && err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });

  } else if (err) {
    const message = typeof err.message === 'string' ? err.message : 'Internal Server Error';
    res.status(500).json({
      success: false,
      message
    });
  }
});

module.exports = app
