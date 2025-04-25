// api/visitor.js (서버less 함수)
import db from '../server/firebase-admin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const ref = db.ref('visitorCount');
      
      // 트랜잭션으로 방문자 수를 안전하게 증가시킴
      await ref.transaction(currentCount => {
        return (currentCount || 0) + 1;
      });

      // 트랜잭션 후 방문자 수를 읽어오기
      const snapshot = await ref.once('value');
      const visitorCount = snapshot.val();

      // JSON 형식으로 반환
      res.status(200).json({ visitorCount });
    } catch (error) {
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
