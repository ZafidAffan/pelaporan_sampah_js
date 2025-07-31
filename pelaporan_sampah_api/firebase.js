// firebase.js
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('pelaporan_sampah_api/serviceAccountKey(sampah).json'); // letakkan JSON key kamu di sini

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'sampah-c8634.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = bucket;
