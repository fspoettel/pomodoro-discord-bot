const { differenceInMinutes, toDate } = require('date-fns')
const Sentry = require('@sentry/node')
const { getFinishedPomodoros } = require('../../lib/pomodoro')
const { sendUserDm } = require('../../lib/discord')
const { breakDone, timerDone } = require('../templates')

let schedule

async function scheduler (client) {
  let finishedPomodoros = []

  try {
    finishedPomodoros = await getFinishedPomodoros()
  } catch (err) {
    Sentry.captureException(err)
  }

  const messagePromises = finishedPomodoros.map(timer => {
    const { finishesAt, userId, type, startedAt } = timer

    const msgCreator = type === 'break' ? breakDone : timerDone
    const minDiff = differenceInMinutes(toDate(finishesAt), toDate(startedAt))

    return sendUserDm(client, userId, msgCreator(minDiff))
  })

  try {
    await Promise.all(messagePromises)
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
