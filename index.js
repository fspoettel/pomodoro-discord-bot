/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */
require('dotenv').config()
const Sentry = require('@sentry/node')
const { withDb } = require('./lib/db')
const { init: initBot } = require('./bot')

const { SENTRY_DSN } = process.env;

(async function () {
  Sentry.init({ dsn: SENTRY_DSN })

  try {
    await initBot()

    const count = await withDb(async function (db, client) {
      const timers = await db.collection('timers').estimatedDocumentCount()
      return timers
    })

    console.log(`Timers in database: ${count}`)
  } catch (err) {
    Sentry.captureException(err)

    Sentry.close(5000).then(() => {
      process.exit(1)
    })
  }
})()
