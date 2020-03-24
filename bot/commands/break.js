const { hasProgress, break: breakT } = require('../templates')
const { HasTimerError } = require('../../lib/pomodoro')
const { getContextPrefix, parseDuration } = require('../utils')

function makeBreakCommand (defaultDuration) {
  return async function ({
    client,
    message,
    pomodoro,
    words
  }) {
    const { author, createdTimestamp } = message
    const { id: userId } = author

    const [, str] = words

    const duration = parseDuration(str, defaultDuration)

    try {
      pomodoro.addPomodoro(userId, createdTimestamp, duration, 'break')
      return message.reply(breakT(duration))
    } catch (err) {
      if (!(err instanceof HasTimerError)) throw err
      const contextPrefix = getContextPrefix(message)
      return message.reply(hasProgress(contextPrefix))
    }
  }
}

module.exports = makeBreakCommand
