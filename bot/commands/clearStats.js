const { clearStats: clearStatsTemplate } = require('../templates')
const { clearStats } = require('../../lib/pomodoro')
const { replyToMessage } = require('../../lib/discord')

async function clearStatsCommand ({
  client,
  message,
  words
}) {
  const { author } = message
  const isToday = words.includes('today')
  await clearStats(author.id, isToday ? 'daily' : 'total')
  return replyToMessage(message, clearStatsTemplate(isToday))
}

module.exports = clearStatsCommand
