const Sentry = require('@sentry/node')
const {
  addMilliseconds,
  addMinutes,
  differenceInMilliseconds,
  differenceInMinutes,
  lightFormat,
  startOfToday,
  toDate
} = require('date-fns')
const { withDb } = require('../lib/db')

class NoTimerError extends Error {}

class HasTimerError extends Error {
  constructor (userId, type) {
    super(`Timer in progress for ${userId}`)
    this.type = type
  }
}

function getInProgressTimer (userId) {
  return withDb(async (db) => {
    const res = await db.collection('timers')
      .find({ userId, finished: false })
      .toArray()

    if (res.length > 1) {
      Sentry.captureException('More than one timer in progress')
    }

    return res[0] || null
  })
}

// eslint-disable-next-line no-unused-vars
function finishInProgressTimer (userId) {
  return withDb(db =>
    db.collection('timers')
      .findOneAndUpdate(
        { userId, finished: false },
        { $set: { finished: true } },
        { upsert: true }
      )
  )
}

async function addPomodoro (userId, minutes, type = 'interval') {
  // @todo handle race condition between scheduler & this
  const existingTimer = await getInProgressTimer(userId)
  if (existingTimer) throw new HasTimerError(userId, type)

  const now = Date.now()

  const timer = {
    startedAt: now,
    finishesAt: addMinutes(toDate(now), minutes).valueOf(),
    finished: false,
    type,
    userId
  }

  await withDb(db =>
    db.collection('timers').insertOne(timer)
  )

  return timer
}

async function getPomodoro (userId) {
  const timer = await getInProgressTimer(userId)
  if (!timer) throw new NoTimerError(`No timer in progress for ${userId}`)
  return timer
}

async function stopPomodoro (userId) {
  const { value: timer } = await withDb(db =>
    db.collection('timers').findOneAndDelete({ userId, finished: false })
  )

  if (!timer) throw new NoTimerError(`No timer in progress for ${userId}`)
  return timer
}

async function resetPomodoro (userId) {
  const existingTimer = await getPomodoro(userId)

  const { _id, startedAt, finishesAt, type } = existingTimer
  const duration = differenceInMilliseconds(finishesAt, startedAt)

  const now = Date.now()

  await withDb(db =>
    db.collection('timers')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            startedAt: now,
            finishesAt: addMilliseconds(toDate(now), duration).valueOf(),
            finished: false
          }
        },
        { upsert: true }
      )
  )

  return {
    duration: differenceInMinutes(finishesAt, startedAt),
    type
  }
}

async function getTimeLeft (userId) {
  const { finishesAt, type } = await getPomodoro(userId)
  const diff = differenceInMilliseconds(toDate(finishesAt), new Date())

  return {
    timeLeft: lightFormat(addMilliseconds(new Date(0), diff), 'mm:ss'),
    type
  }
}

function getFinishedPomodoros () {
  return withDb(async (db) => {
    const finishedTimers = await db.collection('timers')
      .find({
        finished: false,
        finishesAt: { $lt: Date.now() }
      })
      .toArray()

    if (finishedTimers.length === 0) return finishedTimers

    await db.collection('timers').updateMany(
      { _id: { $in: finishedTimers.map(t => t._id) } },
      { $set: { finished: true } },
      { upsert: true }
    )

    return finishedTimers
  })
}

function getStats (userId, mode) {
  return withDb(async (db) => {
    const query = {
      finished: true,
      userId
    }

    if (mode === 'daily') {
      query.finishesAt = {
        $gt: toDate(startOfToday()).valueOf(),
        $lt: Date.now()
      }
    }

    const finishedTimers = await db.collection('timers')
      .find(query)
      .toArray()

    return finishedTimers
      .reduce((acc, curr) => {
        const { type } = curr
        console.log(type)
        const { [type]: countForType } = acc
        return {
          ...acc,
          [type]: countForType + 1
        }
      }, { break: 0, interval: 0 })
  })
}

module.exports = {
  addPomodoro,
  getFinishedPomodoros,
  getStats,
  getTimeLeft,
  HasTimerError,
  NoTimerError,
  resetPomodoro,
  stopPomodoro
}
