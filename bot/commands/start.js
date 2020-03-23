const { hasProgress, start } = require('../templates')
const { HasTimerError } = require('../../lib/pomodoro')
const { getContextPrefix } = require('../utils')

function isInt (num) {
  return num && !Number.isNaN(Number.parseInt(num, 10))
}

function parseDuration (str, defaultVal = 25) {
  if (!str) return defaultVal
  const numChars = str.replace(/\D/gm, '')
  if (isInt(numChars)) return Number.parseInt(numChars, 10)
  return defaultVal
}

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
    const contextPrefix = getContextPrefix(message)
    return message.reply(hasProgress(contextPrefix))
  }
}

module.exports = startCommand
