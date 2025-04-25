import db from '../server/firebase-admin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const ref = db.ref('visitorCount');
      const today = new Date().toISOString().split('T')[0];  // 오늘 날짜 (YYYY-MM-DD)

      // 현재 날짜에 해당하는 방문자 수가 있는지 확인
      const snapshot = await ref.once('value');
      const data = snapshot.val() || { total: 0, today: 0, lastResetDate: today };

      // 오늘 날짜가 달라졌다면 오늘 카운트를 리셋
      if (data.lastResetDate !== today) {
        data.today = 0;
      }

      // 트랜잭션으로 방문자 수를 안전하게 증가시킴
      await ref.transaction(currentCount => {
        return {
          total: (currentCount?.total || 0) + 1,
          today: (currentCount?.today || 0) + 1,
          lastResetDate: today
        };
      });

      // 트랜잭션 후 방문자 수를 읽어오기
      const updatedSnapshot = await ref.once('value');
      const updatedVisitorCount = updatedSnapshot.val();

      res.status(200).json({ 
        total: updatedVisitorCount.total,
        today: updatedVisitorCount.today
      });
    } catch (error) {
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
