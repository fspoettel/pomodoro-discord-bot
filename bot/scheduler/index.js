const Sentry = require('@sentry/node')
const findAndHandleFinishedPomodoros = require('./timers')

let schedule

async function scheduler (client) {
  try {
    await findAndHandleFinishedPomodoros(client)
  } catch (err) {
    console.error(err)
    Sentry.captureException(err)
  } finally {
    bindScheduler(client)
  }
}

function bindScheduler (client) {
  schedule = setTimeout(() => {
    scheduler(client)
  }, 1000)
}

function unbindScheduler () {
  clearTimeout(schedule)
}

module.exports = { bindScheduler, unbindScheduler }
