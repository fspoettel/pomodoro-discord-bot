const { hasProgress, newTimer } = require('../templates')
const { addPomodoro, HasTimerError } = require('../../lib/pomodoro')
const { replyToMessage } = require('../../lib/discord')
const { getContextPrefix, parseDuration } = require('../utils')

function makeBreakCommand (defaultDuration) {
  return async function ({
    client,
    message,
    words
  }) {
    const { author } = message
    const { id: userId } = author

    const [, str] = words

    const duration = parseDuration(str, defaultDuration)

    try {
      await addPomodoro(userId, duration, 'break')
      return replyToMessage(message, newTimer(duration, 'break'))
    } catch (err) {
      if (!(err instanceof HasTimerError)) throw err
      const contextPrefix = getContextPrefix(message)
      return replyToMessage(message, hasProgress(contextPrefix))
    }
  }
}

module.exports = makeBreakCommand
