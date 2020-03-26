const { differenceInMilliseconds } = require('date-fns')
const { formatDuration } = require('../utils')
const { getFinishedPomodoros } = require('../../lib/pomodoro')
const { sendUserDm } = require('../../lib/discord')
const { breakDone, timerDone } = require('../templates')

async function findAndHandleFinishedPomodoros (client) {
  const finishedPomodoros = await getFinishedPomodoros()

  const messagePromises = finishedPomodoros.map(async (timer) => {
    const {
      finishesAt,
      startedAt,
      type,
      userId
    } = timer

    const isBreak = type === 'break'
    const diff = differenceInMilliseconds(finishesAt, startedAt)

    const msgCreator = isBreak ? breakDone : timerDone

    return sendUserDm(client, userId, msgCreator(formatDuration(diff)))
  })

  return Promise.all(messagePromises)
}

module.exports = findAndHandleFinishedPomodoros
