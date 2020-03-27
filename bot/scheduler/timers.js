const { differenceInMilliseconds } = require('date-fns')
const { formatDuration } = require('../utils')
const { getFinishedPomodoros, updateFinishedPomodoro } = require('../../lib/pomodoro')
const { sendUserDm } = require('../../lib/discord')
const { breakDone, timerDone } = require('../templates')

async function findAndHandleFinishedPomodoros (client) {
  const finishedPomodoros = await getFinishedPomodoros()
  if (finishedPomodoros.length === 0) return

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

    try {
      await sendUserDm(client, userId, msgCreator(formatDuration(diff)))
    } catch (err) {
      if (err.code !== 50007) throw err
      // User has blocked the bot, should delete the timer
    }

    await updateFinishedPomodoro(timer)
  })

  await Promise.all(messagePromises)
}

module.exports = findAndHandleFinishedPomodoros
