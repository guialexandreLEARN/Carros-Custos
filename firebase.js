// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./vendascarro-estudo-firebase-adminsdk-qpzbm-a8bb66e7e2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vendascarro-estudo.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
