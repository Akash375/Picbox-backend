const dotenv = require("dotenv");
const admin = require("firebase-admin");

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.SERVICE_KEY))
});

module.exports = admin;