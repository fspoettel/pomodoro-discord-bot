const { NoTimerError } = require('../../lib/pomodoro')
const { noInProgress, reset } = require('../templates')
const { getContextPrefix } = require('../utils')

async function resetCommand ({
  client,
  message,
  pomodoro,
  words
}) {
  const { author, createdTimestamp } = message

  try {
    const duration = pomodoro.resetPomodoro(author.id, createdTimestamp)
    return message.reply(reset(duration))
  } catch (err) {
    if (!(err instanceof NoTimerError)) throw err
    const contextPrefix = getContextPrefix(message)
    return message.reply(noInProgress(contextPrefix))
  }
}

module.exports = resetCommand
