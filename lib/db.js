const MongoClient = require('mongodb').MongoClient

const { MONGODB_URI } = process.env

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

async function withDb (fn) {
  if (!client.isConnected()) {
    await client.connect()
  }

  const db = client.db()
  return fn(db)
}

module.exports = { withDb }
