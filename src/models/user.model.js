const Mongoose = require('mongoose');

const schema = Mongoose.Schema(
  {
    domain: { type: String, required: true, index: true },
    slackId: { type: String, required: true, unique: true },
    encodedName: { type: String, required: true },
  },
  // --- Options ---
  {
    collection: 'users', // sets mongo collection name
    timestamps: true, // Adds createdAt, updatedAt
  },
);

const User = Mongoose.model('User', schema);

User.fromEncodedName = function fromEncodedName(domain, encodedName) {
  if (!domain) {
    throw new Error('Missing domain!');
  }
  const matchId = encodedName.match(/^<@([^|]+)/);
  if (!matchId || !matchId[1]) {
    throw new Error(`Cannot parse encodedName "${encodedName}"`);
  }
  const [, slackId] = matchId;
  return new User({ domain, encodedName, slackId });
};

User.findUpsert = function findUpsert(domain, encodedName) {
  const { slackId } = User.fromEncodedName(domain, encodedName);
  const q = { domain, slackId };
  const u = { domain, slackId, encodedName };
  return User.findOneAndUpdate(q, u, {
    upsert: true,
    new: true,
    useFindAndModify: false,
  });
};

module.exports = User;
