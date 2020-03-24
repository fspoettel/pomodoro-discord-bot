const { hasProgress, start } = require('../templates')
const { HasTimerError } = require('../../lib/pomodoro')
const { getContextPrefix, parseDuration } = require('../utils')

async function startCommand ({
  client,
  message,
  pomodoro,
  words
}) {
  const { author, createdTimestamp } = message
  const { id: userId } = author

  const [, str] = words

  const duration = parseDuration(str)

  try {
    pomodoro.addPomodoro(userId, createdTimestamp, duration)
    return message.reply(start(duration))
  } catch (err) {
    if (!(err instanceof HasTimerError)) throw err
    const { type } = err
    const contextPrefix = getContextPrefix(message)
    return message.reply(hasProgress(contextPrefix, type))
  }
}

module.exports = startCommand
