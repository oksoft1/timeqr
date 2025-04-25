// /api/count.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Vercel 환경 변수에서 MongoDB 연결 문자열을 읽어옵니다.
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const database = client.db('visitorDb'); // MongoDB에서 설정한 데이터베이스 이름
    const visitors = database.collection('visitors'); // MongoDB에서 설정한 컬렉션 이름

    // 방문자 수를 찾거나 초기화
    const visitor = await visitors.findOne({ name: 'visitor' });

    if (!visitor) {
      await visitors.insertOne({ name: 'visitor', count: 1 });
      return res.status(200).json({ count: 1 });
    }

    const updatedCount = visitor.count + 1;
    await visitors.updateOne(
      { name: 'visitor' },
      { $set: { count: updatedCount } }
    );

    res.status(200).json({ count: updatedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error accessing database' });
  } finally {
    await client.close();
  }
}
