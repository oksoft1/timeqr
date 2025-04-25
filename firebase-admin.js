// server/firebase-admin.js
import * as admin from 'firebase-admin';
import path from 'path';

// Firebase 서비스 계정 인증 정보로 초기화
const serviceAccount = require(path.join(__dirname, '../timeqrcounter-firebase-adminsdk-fbsvc-bc683e3409.json'));  // 서비스 계정 파일 경로
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://timeqrcounter-default-rtdb.firebaseio.com",  // Firebase Realtime Database URL
  });
}

const db = admin.database();
export default db;