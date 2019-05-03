const mongoose = require('mongoose');

const config = require('../config');

const { dbUri } = config[process.env.NODE_ENV];

console.log('Mongoose connecting to database:', dbUri.split('/').pop());

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

module.exports = mongoose;
