console.log('*** TEST SUITE ***');

if (process.env.NODE_ENV) {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
} else {
  throw new Error('process.env.NODE_ENV is not defined!');
}

const mongoose = require('./mongooseConnect');

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

after(() => {
  console.log('Disconnecting Mongoose - Goodbye!');
  mongoose.disconnect();
});
