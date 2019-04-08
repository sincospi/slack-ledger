console.log('*** TEST SUITE ***');

require('./setYamlEnvVariables');
const mongoose = require('./mongooseConnect');

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

after(() => {
  console.log('Disconnecting Mongoose - Goodbye!');
  mongoose.disconnect();
});
