const mongoose = require('mongoose');

console.log(
  'Mongoose connecting to database:',
  process.env.DB_URI.split('/').pop(),
);

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
);

module.exports = mongoose;
