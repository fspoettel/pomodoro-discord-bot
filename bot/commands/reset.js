const { replyToMessage } = require('../../lib/discord')
const { NoTimerError, resetPomodoro } = require('../../lib/pomodoro')
const { noInProgress, reset } = require('../templates')
const { getContextPrefix } = require('../utils')

async function resetCommand ({ client, message, words }) {
  const { author } = message

  try {
    const { duration, type } = await resetPomodoro(author.id)
    return replyToMessage(message, reset(duration, type))
  } catch (err) {
    if (!(err instanceof NoTimerError)) throw err
    const contextPrefix = getContextPrefix(message)
    return replyToMessage(message, noInProgress(contextPrefix))
  }
}

module.exports = resetCommand
