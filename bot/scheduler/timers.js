const { differenceInMinutes, toDate } = require('date-fns')
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
    const minDiff = differenceInMinutes(toDate(finishesAt), toDate(startedAt))

    const msgCreator = isBreak ? breakDone : timerDone

    return sendUserDm(client, userId, msgCreator(minDiff))
  })

  return Promise.all(messagePromises)
}

module.exports = findAndHandleFinishedPomodoros
