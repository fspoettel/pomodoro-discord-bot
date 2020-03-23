const {
  addMilliseconds,
  addMinutes,
  differenceInMilliseconds,
  differenceInMinutes,
  lightFormat,
  isPast,
  toDate
} = require('date-fns')

class NoTimerError extends Error {}

class HasTimerError extends Error {}

class Pomodoro {
  constructor () {
    this.store = new Map()
  }

  getPomodoro (userId) {
    const timer = this.store.get(userId)

    if (!timer) {
      throw new NoTimerError(`No timer in progress for ${userId}`)
    }

    return timer
  }

  getTimeLeft (userId) {
    const timer = this.getPomodoro(userId)
    const diff = differenceInMilliseconds(toDate(timer.finishesAt), new Date())

    const helperDate = addMilliseconds(new Date(0), diff)
    return lightFormat(helperDate, 'mm:ss')
  }

  getOverduePomodoros () {
    if (this.store.size === 0) return []

    const pomodoros = []

    this.store.forEach(timer => {
      const { finishesAt } = timer
      if (isPast(toDate(finishesAt))) pomodoros.push(timer)
    })

    return pomodoros
  }

  addPomodoro (userId, timestamp, minutes) {
    // @todo: handle race condition between scheduler & this
    if (this.store.has(userId)) {
      throw new HasTimerError(`Timer in progress for ${userId}`)
    }

    const timer = {
      startedAt: timestamp,
      finishesAt: addMinutes(toDate(timestamp), minutes).valueOf(),
      id: userId
    }

    this.store.set(userId, timer)
  }

  deletePomodoro (userId) {
    this.store.delete(userId)
  }

  stopPomodoro (userId) {
    if (!this.store.has(userId)) {
      throw new NoTimerError(`No timer in progress for ${userId}`)
    }

    this.deletePomodoro(userId)
  }

  resetPomodoro (userId, timestamp) {
    if (!this.store.has(userId)) {
      throw new NoTimerError(`No timer in progress for ${userId}`)
    }

    const existingTimer = this.store.get(userId)

    const { startedAt, finishesAt } = existingTimer

    const duration = differenceInMilliseconds(finishesAt, startedAt)

    this.store.set(userId, {
      startedAt: timestamp,
      finishesAt: addMilliseconds(toDate(timestamp), duration).valueOf(),
      id: userId
    })

    return differenceInMinutes(finishesAt, startedAt)
  }
}

module.exports = {
  HasTimerError,
  NoTimerError,
  Pomodoro
}
