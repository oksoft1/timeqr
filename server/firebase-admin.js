// firebase-admin.js
const admin = require("firebase-admin");

const serviceAccount = require("./path/to/your/firebase/credentials.json"); // 다운로드한 Firebase 인증 파일 경로

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://timeqrcounter-default-rtdb.firebaseio.com/" // Firebase 실시간 DB URL
});

const db = admin.database();

module.exports = db;
