// /api/count.js
import { MongoClient } from 'mongodb';

const uri = 'YOUR_MONGODB_CONNECTION_STRING';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const database = client.db('visitorDb');
    const visitors = database.collection('visitors');

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
