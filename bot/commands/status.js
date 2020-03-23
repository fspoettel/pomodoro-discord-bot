const { noInProgress, status } = require('../templates')
const { NoTimerError } = require('../../lib/pomodoro')
const { getContextPrefix } = require('../utils')

async function statusCommand ({ client, message, pomodoro, words }) {
  const { author } = message
  const contextPrefix = getContextPrefix(message)

  try {
    const timeLeft = pomodoro.getTimeLeft(author.id)
    return message.reply(status(timeLeft))
  } catch (err) {
    if (!(err instanceof NoTimerError)) throw err
    return message.reply(noInProgress(contextPrefix))
  }
}

module.exports = statusCommand
