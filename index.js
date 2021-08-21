const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const dbConfig = require('./config/db.config');
const cors = require('cors');
const productRoutes = require('./app/routes/product.routes');
const imageRoutes = require('./app/routes/image.routes');

mongoose.connect(dbConfig.url)
  .then(() => {
    console.log("Successfully connected to the database");
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
  });

const app = express();

app.use(morgan("dev"));
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  req.getUrl = function () {
    return req.protocol + "://" + req.get('host');
  }
  return next();
});

app.use('/product', cors(), productRoutes);
app.use('/image', cors(), imageRoutes);

/* app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
}); */

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});