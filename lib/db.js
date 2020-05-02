const MongoClient = require('mongodb').MongoClient

const { MONGO_URL } = process.env

let client
let mongoClient

async function initDb () {
  client = new MongoClient(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  mongoClient = await client.connect()
}

async function withDb (fn) {
  const db = mongoClient.db()
  return fn(db)
}

module.exports = { initDb, withDb }
