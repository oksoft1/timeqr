// server/app.js
const express = require('express');
const db = require('./firebase-admin'); // Firebase 설정 파일 불러오기

const app = express();

app.get('/', async (req, res) => {
  const ref = db.ref('visitorCount');
  
  // 트랜잭션으로 방문자 수를 안전하게 증가시킴
  await ref.transaction(currentCount => {
    return (currentCount || 0) + 1;
  });

  // 현재 방문자 수를 읽어옴
  const snapshot = await ref.once('value');
  const visitorCount = snapshot.val();

  res.send(`현재 방문자 수: ${visitorCount}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
