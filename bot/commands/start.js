const { hasProgress, newTimer } = require('../templates')
const { addPomodoro, HasTimerError } = require('../../lib/pomodoro')
const { getContextPrefix, parseDuration } = require('../utils')

async function startCommand ({ client, message, words }) {
  const { author } = message
  const { id: userId } = author

  const [, str] = words

  const duration = parseDuration(str)

  try {
    await addPomodoro(userId, duration, 'interval')
    return message.reply(newTimer(duration, 'interval'))
  } catch (err) {
    if (!(err instanceof HasTimerError)) throw err
    const { type } = err
    const contextPrefix = getContextPrefix(message)
    return message.reply(hasProgress(contextPrefix, type))
  }
}

module.exports = startCommand
