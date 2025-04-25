// api/count.js
const { MongoClient } = require('mongodb');

let cachedClient = null;

module.exports = async (req, res) => {
  const uri = process.env.MONGODB_URI;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  const database = cachedClient.db('visitorDb');
  const visitors = database.collection('visitors');

  try {
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

    return res.status(200).json({ count: updatedCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
