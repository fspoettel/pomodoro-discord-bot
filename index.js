/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */
const http = require('http')
require('dotenv').config()
const Sentry = require('@sentry/node')
const { initDb, withDb } = require('./lib/db')
const { init: initBot } = require('./bot')

const { NODE_ENV, PORT, SENTRY_DSN } = process.env;

(async function () {
  Sentry.init({ dsn: SENTRY_DSN })

  try {
    await initDb()
    await initBot()
    const count = await withDb((db, client) =>
      db.collection('timers').estimatedDocumentCount()
    )

    const server = http.createServer((req, res) => {
      res.setHeader('Content-type', 'text/plain')
      res.writeHead(200)
      res.end('ok')
    })

    server.listen(PORT, () => {
      console.log(`Timers in database: ${count}`)
    })
  } catch (err) {
    if (NODE_ENV !== 'production') {
      console.error(err)
    }

    Sentry.captureException(err)

    Sentry.close(5000).then(() => {
      process.exit(1)
    })
  }
})()
