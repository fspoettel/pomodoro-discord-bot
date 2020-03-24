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

class HasTimerError extends Error {
  constructor (userId, type) {
    super(`Timer in progress for ${userId}`)
    this.type = type
  }
}

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
    const { finishesAt, type } = this.getPomodoro(userId)

    const diff = differenceInMilliseconds(toDate(finishesAt), new Date())

    const helperDate = addMilliseconds(new Date(0), diff)

    return {
      timeLeft: lightFormat(helperDate, 'mm:ss'),
      type
    }
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

  addPomodoro (userId, timestamp, minutes, type = 'interval') {
    // @todo: handle race condition between scheduler & this
    if (this.store.has(userId)) {
      throw new HasTimerError(userId, type)
    }

    const timer = {
      startedAt: timestamp,
      finishesAt: addMinutes(toDate(timestamp), minutes).valueOf(),
      type,
      id: userId
    }

    this.store.set(userId, timer)
  }

  deletePomodoro (userId) {
    const timer = this.store.get(userId)
    this.store.delete(userId)
    return timer
  }

  stopPomodoro (userId) {
    if (!this.store.has(userId)) {
      throw new NoTimerError(`No timer in progress for ${userId}`)
    }

    return this.deletePomodoro(userId)
  }

  resetPomodoro (userId, timestamp) {
    if (!this.store.has(userId)) {
      throw new NoTimerError(`No timer in progress for ${userId}`)
    }

    const existingTimer = this.store.get(userId)

    const { startedAt, finishesAt, type } = existingTimer

    const duration = differenceInMilliseconds(finishesAt, startedAt)

    this.store.set(userId, {
      startedAt: timestamp,
      finishesAt: addMilliseconds(toDate(timestamp), duration).valueOf(),
      id: userId,
      type
    })

    return {
      duration: differenceInMinutes(finishesAt, startedAt),
      type: existingTimer.type
    }
  }
}

module.exports = {
  HasTimerError,
  NoTimerError,
  Pomodoro
}
