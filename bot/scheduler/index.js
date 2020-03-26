const Sentry = require('@sentry/node')
const findAndHandleFinishedPomodoros = require('./timers')

let schedule

async function scheduler (client) {
  try {
    await findAndHandleFinishedPomodoros(client)
  } catch (err) {
    Sentry.captureException(err)
  }

  // @todo this might loop indef. if a user blocks the bot. How does it handle gateway outages?
  bindScheduler(client)
}

function bindScheduler (client) {
  schedule = setTimeout(() => {
    scheduler(client)
  }, 300)
}

function unbindScheduler () {
  clearTimeout(schedule)
}

module.exports = { bindScheduler, unbindScheduler }
