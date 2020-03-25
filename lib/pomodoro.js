const Sentry = require('@sentry/node')
const {
  addMilliseconds,
  addMinutes,
  differenceInMilliseconds,
  differenceInMinutes,
  lightFormat,
  toDate
} = require('date-fns')
const { withDb } = require('../lib/db')

function insertTimer (timer) {
  return withDb(async function (db) {
    return db
      .collection('timers')
      .insertOne(timer)
  })
}

function getInProgressTimer (userId) {
  return withDb(async function (db) {
    const res = await db.collection('timers')
      .find({ userId, finished: false })
      .toArray()

    if (res.length > 1) {
      Sentry.captureException('More than one timer in progress')
    }

    return res[0] || null
  })
}

function updateInProgressTimer (_id, payload) {
  return withDb(async function (db) {
    return db.collection('timers')
      .findOneAndUpdate(
        { _id },
        { $set: { ...payload } },
        { upsert: true })
  })
}

// eslint-disable-next-line no-unused-vars
function finishInProgressTimer (userId) {
  return withDb(async function (db) {
    return db.collection('timers')
      .findOneAndUpdate(
        { userId, finished: false },
        { $set: { finished: true } },
        { upsert: true }
      )
  })
}

function deleteInProgressTimer (userId) {
  return withDb(async function (db) {
    return db.collection('timers')
      .findOneAndDelete({ userId, finished: false })
  })
}

function getFinishedTimers () {
  return withDb(async function (db) {
    const finishedTimers = await db.collection('timers')
      .find({
        finished: false,
        finishesAt: { $lt: Date.now() }
      })
      .toArray()

    if (finishedTimers.length === 0) return finishedTimers

    await db.collection('timers').updateMany({
      _id: { $in: finishedTimers.map(t => t._id) }
    }, {
      $set: { finished: true }
    }, {
      upsert: true
    })

    return finishedTimers
  })
}

class NoTimerError extends Error {}

class HasTimerError extends Error {
  constructor (userId, type) {
    super(`Timer in progress for ${userId}`)
    this.type = type
  }
}

class Pomodoro {
  async addPomodoro (userId, minutes, type = 'interval') {
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

    await insertTimer(timer)
    return timer
  }

  async getPomodoro (userId) {
    const timer = await getInProgressTimer(userId)
    if (!timer) throw new NoTimerError(`No timer in progress for ${userId}`)
    return timer
  }

  async stopPomodoro (userId) {
    const { value: timer } = await deleteInProgressTimer(userId)
    if (!timer) throw new NoTimerError(`No timer in progress for ${userId}`)
    return timer
  }

  async resetPomodoro (userId) {
    const existingTimer = await this.getPomodoro(userId)

    const { _id, startedAt, finishesAt, type } = existingTimer
    const duration = differenceInMilliseconds(finishesAt, startedAt)

    const now = Date.now()

    await updateInProgressTimer(_id, {
      startedAt: now,
      finishesAt: addMilliseconds(toDate(now), duration).valueOf(),
      finished: false
    })

    return {
      duration: differenceInMinutes(finishesAt, startedAt),
      type
    }
  }

  async getTimeLeft (userId) {
    const { finishesAt, type } = await this.getPomodoro(userId)

    const diff = differenceInMilliseconds(toDate(finishesAt), new Date())
    const helperDate = addMilliseconds(new Date(0), diff)

    return {
      timeLeft: lightFormat(helperDate, 'mm:ss'),
      type
    }
  }

  async getFinishedPomodoros () {
    return getFinishedTimers()
  }
}

module.exports = {
  HasTimerError,
  NoTimerError,
  Pomodoro
}
