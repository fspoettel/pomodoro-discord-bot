const Sentry = require('@sentry/node')
const {
  addMilliseconds,
  addMinutes,
  differenceInMilliseconds,
  startOfToday,
  toDate
} = require('date-fns')
const { withDb } = require('./db')

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
    duration: differenceInMilliseconds(finishesAt, startedAt),
    type
  }
}

async function getTimeLeft (userId) {
  const { finishesAt, type } = await getPomodoro(userId)

  return {
    timeLeft: differenceInMilliseconds(finishesAt, new Date()),
    type
  }
}

function getFinishedPomodoros () {
  return withDb((db) =>
    db.collection('timers')
      .find({
        finished: false,
        finishesAt: { $lt: Date.now() }
      })
      .toArray()
  )
}

function updateFinishedPomodoro (timer) {
  return withDb((db) =>
    db.collection('timers')
      .updateOne(
        { _id: timer._id },
        { $set: { finished: true } },
        { upsert: true }
      )
  )
}

function getFinishedTimersQuery (userId, mode) {
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

  return query
}

function getStats (userId, mode) {
  return withDb(async (db) => {
    const query = getFinishedTimersQuery(userId, mode)

    const finishedTimers = await db.collection('timers')
      .find(query)
      .toArray()

    return finishedTimers
      .reduce((acc, {
        finishesAt,
        startedAt,
        type
      }) => ({
        ...acc,
        count: {
          ...acc.count,
          [type]: acc.count[type] + 1
        },
        duration: {
          ...acc.duration,
          [type]: acc.duration[type] + differenceInMilliseconds(finishesAt, startedAt)
        }
      }), {
        count: {
          break: 0,
          interval: 0
        },
        duration: {
          break: 0,
          interval: 0

        }
      })
  })
}

function clearStats (userId, mode) {
  return withDb(async (db) => {
    const query = getFinishedTimersQuery(userId, mode)
    await db.collection('timers').deleteMany(query)
  })
}

module.exports = {
  addPomodoro,
  clearStats,
  getFinishedPomodoros,
  getStats,
  getTimeLeft,
  HasTimerError,
  NoTimerError,
  resetPomodoro,
  stopPomodoro,
  updateFinishedPomodoro
}
