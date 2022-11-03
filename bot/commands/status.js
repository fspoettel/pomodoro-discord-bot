const { noInProgress, status } = require('../templates')
const { getTimeLeft, NoTimerError } = require('../../lib/pomodoro')
const { replyToMessage } = require('../../lib/discord')
const { formatDuration, getContextPrefix } = require('../utils')

async function statusCommand ({ client, message, words }) {
  const { author } = message
  const contextPrefix = getContextPrefix(message)

  try {
    const { timeLeft, type } = await getTimeLeft(author.id)
    return replyToMessage(message, status(formatDuration(timeLeft), type))
  } catch (err) {
    if (!(err instanceof NoTimerError)) throw err
    return replyToMessage(message, noInProgress(contextPrefix))
  }
}

module.exports = statusCommand
