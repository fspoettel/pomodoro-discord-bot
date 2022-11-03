const { noInProgress, stop } = require('../templates')
const { stopPomodoro, NoTimerError } = require('../../lib/pomodoro')
const { replyToMessage } = require('../../lib/discord')
const { getContextPrefix } = require('../utils')

async function stopCommand ({ client, message, words }) {
  const { author } = message
  const contextPrefix = getContextPrefix(message)

  try {
    const { type } = await stopPomodoro(author.id)
    return replyToMessage(message, stop(contextPrefix, type))
  } catch (err) {
    if (!(err instanceof NoTimerError)) throw err
    return replyToMessage(message, noInProgress(contextPrefix))
  }
}

module.exports = stopCommand
