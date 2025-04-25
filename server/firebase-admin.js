// server/firebase-admin.js
import * as admin from 'firebase-admin';

// Firebase 서비스 계정 인증 정보로 초기화
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://timeqrcounter-default-rtdb.firebaseio.com",  // Firebase Realtime Database URL
  });
}

const db = admin.database();
export default db;