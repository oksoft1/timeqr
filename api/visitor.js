import db from '../server/firebase-admin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const ref = db.ref('visitorCount');
      const dailyRef = db.ref('dailyVisitorCount');

      const currentDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" 형식

      // 트랜잭션으로 전체 방문자 수를 증가시킴
      await ref.transaction(currentCount => {
        return (currentCount || 0) + 1;
      });

      // 오늘의 방문자 수를 증가시킴
      await dailyRef.transaction(dailyCounts => {
        dailyCounts = dailyCounts || {};
        dailyCounts[currentDate] = (dailyCounts[currentDate] || 0) + 1;
        return dailyCounts;
      });

      // 트랜잭션 후 방문자 수를 읽어오기
      const totalSnapshot = await ref.once('value');
      const totalVisitorCount = totalSnapshot.val();

      const dailySnapshot = await dailyRef.once('value');
      const dailyCounts = dailySnapshot.val();
      const todayVisitorCount = dailyCounts ? dailyCounts[currentDate] || 0 : 0;

      // JSON 형식으로 반환
      res.status(200).json({
        visitorCount: totalVisitorCount,
        todayVisitorCount
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
