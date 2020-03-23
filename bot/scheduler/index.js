const { differenceInMinutes, toDate } = require('date-fns')
const { sendUserDm } = require('../../lib/discord')
const { timerDone } = require('../templates')

let schedule

async function scheduler (client, pomodoro) {
  const overduePomodoros = pomodoro.getOverduePomodoros()

  const messagePromises = overduePomodoros.map(timer => {
    const { finishesAt, id, startedAt } = timer

    const minDiff = differenceInMinutes(toDate(finishesAt), toDate(startedAt))

    return sendUserDm(client, id, timerDone(minDiff))
      .then(() => pomodoro.deletePomodoro(id))
  })

  // @todo handle errors
  await Promise.all(messagePromises)

  bindScheduler(client, pomodoro)
}

function bindScheduler (client, pomodoro) {
  schedule = setTimeout(() => {
    scheduler(client, pomodoro)
  })
}

function unbindScheduler () {
  clearTimeout(schedule)
}

module.exports = { bindScheduler, unbindScheduler }
